import { redirect, type RequestHandler } from '@sveltejs/kit';
import { clearSessionCookie } from '$lib/server/session';

export const POST: RequestHandler = async ({ cookies }) => {
  clearSessionCookie(cookies);
  throw redirect(303, '/');
};

export const GET: RequestHandler = async ({ cookies }) => {
  clearSessionCookie(cookies);
  throw redirect(303, '/');
};
