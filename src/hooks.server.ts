import type { Handle } from '@sveltejs/kit';
import { getSessionUser } from '$lib/server/session';
import { initDbIndexes } from '$lib/server/db';

initDbIndexes().catch((err) => console.warn('DB index init:', err));

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.user = await getSessionUser(event.cookies);
  const response = await resolve(event);

  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
};
