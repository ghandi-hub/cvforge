import crypto from 'node:crypto';
import type { Cookies } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getDb } from './db';
import { ObjectId } from 'mongodb';

const COOKIE_NAME = 'cvforge_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function getSecret(): string {
  return env.AUTH_SECRET || 'cvforge-default-dev-secret-change-in-production-min-32-chars';
}

export function createToken(userId: string): string {
  const secret = getSecret();
  const expires = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `${userId}:${expires}`;
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${Buffer.from(payload).toString('base64url')}.${signature}`;
}

export function verifyToken(token: string): string | null {
  try {
    const [encPayload, sig] = token.split('.');
    if (!encPayload || !sig) return null;

    const payload = Buffer.from(encPayload, 'base64url').toString('utf8');
    const secret = getSecret();
    const expectedSig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');

    const bufSig = Buffer.from(sig);
    const bufExpected = Buffer.from(expectedSig);
    if (bufSig.length !== bufExpected.length || !crypto.timingSafeEqual(bufSig, bufExpected)) {
      return null;
    }

    const [userId, expiresStr] = payload.split(':');
    if (Date.now() > parseInt(expiresStr, 10)) {
      return null;
    }
    return userId;
  } catch {
    return null;
  }
}

export function setSessionCookie(cookies: Cookies, userId: string) {
  const token = createToken(userId);
  cookies.set(COOKIE_NAME, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE
  });
}

export function clearSessionCookie(cookies: Cookies) {
  cookies.delete(COOKIE_NAME, { path: '/' });
}

export async function getSessionUser(cookies: Cookies) {
  const token = cookies.get(COOKIE_NAME);
  if (!token) return null;

  const userId = verifyToken(token);
  if (!userId) return null;

  try {
    const db = await getDb();
    let filter;
    try {
      filter = { _id: new ObjectId(userId) };
    } catch {
      filter = { _id: userId as unknown as ObjectId };
    }
    const user = await db.collection('users').findOne(filter);
    if (!user) return null;
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl || null
    };
  } catch {
    return null;
  }
}
