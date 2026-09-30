import { json, error, type RequestHandler } from '@sveltejs/kit';
import { getUserResumes, createResume } from '$lib/server/resumes';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) throw error(401, 'UNAUTHORIZED');
  const resumes = await getUserResumes(locals.user.id);
  return json({ resumes });
};

export const POST: RequestHandler = async ({ locals, request }) => {
  if (!locals.user) throw error(401, 'UNAUTHORIZED');
  const body = await request.json().catch(() => ({}));
  const title = (body.title || 'Untitled CV').toString().trim().slice(0, 100);
  const newResume = await createResume(locals.user.id, title);
  return json({ resume: newResume }, { status: 201 });
};
