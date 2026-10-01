import { json, error, type RequestHandler } from '@sveltejs/kit';
import { generateCoverLetterText } from '$lib/cover-letter/generator';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) throw error(401, 'UNAUTHORIZED');

  const body = await request.json().catch(() => null);
  if (!body || !body.cvData) {
    throw error(400, 'INVALID_PAYLOAD: cvData is required');
  }

  const content = generateCoverLetterText({
    cvData: body.cvData,
    recipientName: body.recipientName,
    companyName: body.companyName,
    companyLocation: body.companyLocation,
    jobTitle: body.jobTitle,
    letterDate: body.letterDate,
    tone: body.tone,
    jobDescription: body.jobDescription
  });

  return json({
    success: true,
    content
  });
};
