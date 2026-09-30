import { redirect, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import crypto from 'node:crypto';

export const GET: RequestHandler = async ({ url, cookies }) => {
  const clientId = env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw redirect(303, '/login?error=oauth_not_configured');
  }

  const state = crypto.randomBytes(16).toString('hex');
  cookies.set('cvforge_oauth_state', state, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10 // 10 minutes
  });

  const baseUrl = env.PUBLIC_APP_URL || url.origin;
  const redirectUri = `${baseUrl}/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'select_account'
  });

  throw redirect(303, `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
};
