import { redirect, error, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getDb } from '$lib/server/db';
import { setSessionCookie } from '$lib/server/session';

export const GET: RequestHandler = async ({ url, cookies }) => {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const savedState = cookies.get('cvforge_oauth_state');

  cookies.delete('cvforge_oauth_state', { path: '/' });

  if (!code || !state || !savedState || state !== savedState) {
    throw error(400, 'Invalid or expired OAuth state');
  }

  const clientId = env.GOOGLE_CLIENT_ID;
  const clientSecret = env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw error(500, 'Google OAuth credentials not configured');
  }

  const baseUrl = env.PUBLIC_APP_URL || url.origin;
  const redirectUri = `${baseUrl}/auth/google/callback`;

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenRes.ok) {
      throw new Error('Failed to exchange token with Google');
    }

    const tokenData = await tokenRes.json();
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    if (!userRes.ok) {
      throw new Error('Failed to fetch user profile from Google');
    }

    const profile = await userRes.json();
    const db = await getDb();
    const now = new Date();

    let user = await db.collection('users').findOne({
      $or: [{ googleId: profile.sub }, { email: profile.email }]
    });

    if (!user) {
      const ins = await db.collection('users').insertOne({
        googleId: profile.sub,
        email: profile.email,
        name: profile.name || profile.email.split('@')[0],
        avatarUrl: profile.picture || null,
        createdAt: now,
        updatedAt: now
      });
      setSessionCookie(cookies, ins.insertedId.toString());
    } else {
      await db.collection('users').updateOne(
        { _id: user._id },
        {
          $set: {
            googleId: profile.sub,
            name: profile.name || user.name,
            avatarUrl: profile.picture || user.avatarUrl,
            updatedAt: now
          }
        }
      );
      setSessionCookie(cookies, user._id.toString());
    }

    throw redirect(303, '/dashboard');
  } catch (err: any) {
    if (err?.status === 303) throw err;
    console.error('OAuth Callback Error:', err);
    throw error(500, 'AUTHENTICATION_FAILED');
  }
};
