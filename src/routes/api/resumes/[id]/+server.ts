import { json, error, type RequestHandler } from '@sveltejs/kit';
import { getResumeById, updateResume, deleteResume } from '$lib/server/resumes';

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) throw error(401, 'UNAUTHORIZED');
  const id = params.id as string;
  const resume = await getResumeById(id, locals.user.id);
  if (!resume) throw error(404, 'NOT_FOUND');
  return json({ resume });
};

export const PATCH: RequestHandler = async ({ params, locals, request }) => {
  if (!locals.user) throw error(401, 'UNAUTHORIZED');
  const id = params.id as string;
  const body = await request.json().catch(() => null);
  if (!body) throw error(400, 'INVALID_PAYLOAD');

  const updated = await updateResume(id, locals.user.id, body);
  if (!updated) throw error(404, 'NOT_FOUND');
  return json({ resume: updated });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) throw error(401, 'UNAUTHORIZED');
  const id = params.id as string;
  const ok = await deleteResume(id, locals.user.id);
  if (!ok) throw error(404, 'NOT_FOUND');
  return json({ success: true });
};
