import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserResumes } from '$lib/server/resumes';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(303, '/login');
  }

  const resumes = await getUserResumes(locals.user.id);
  return {
    user: locals.user,
    resumes
  };
};
