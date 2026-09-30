import { json, error, type RequestHandler } from '@sveltejs/kit';
import { duplicateResume } from '$lib/server/resumes';

export const POST: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) throw error(401, 'UNAUTHORIZED');
  const id = params.id as string;
  const copy = await duplicateResume(id, locals.user.id);
  if (!copy) throw error(404, 'NOT_FOUND');
  return json({ resume: copy }, { status: 201 });
};
