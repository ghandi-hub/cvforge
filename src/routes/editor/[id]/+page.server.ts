import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getResumeById } from '$lib/server/resumes';

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) {
    throw redirect(303, '/login');
  }

  const id = params.id as string;
  const resume = await getResumeById(id, locals.user.id);
  if (!resume) {
    throw error(404, 'CV_NOT_FOUND');
  }

  return {
    user: locals.user,
    resume
  };
};
