import { json, error, type RequestHandler } from '@sveltejs/kit';
import { analyzeCVAgainstJD } from '$lib/ats/analyzer';

export const POST: RequestHandler = async ({ locals, request }) => {
  if (!locals.user) throw error(401, 'UNAUTHORIZED');

  const body = await request.json().catch(() => null);
  if (!body || typeof body.jobDescription !== 'string') {
    throw error(400, 'JOB_DESCRIPTION_REQUIRED');
  }

  const jdText = body.jobDescription;
  const cvData = body.cvData || {};

  // Flatten CV into searchable plain text
  const parts: string[] = [];
  if (cvData.basics) {
    parts.push(cvData.basics.name, cvData.basics.headline, cvData.basics.location);
  }
  if (cvData.summary) parts.push(cvData.summary);

  if (Array.isArray(cvData.experience)) {
    cvData.experience.forEach((e: any) => {
      parts.push(e.position, e.company, e.description, ...(e.achievements || []));
    });
  }
  if (Array.isArray(cvData.education)) {
    cvData.education.forEach((e: any) => {
      parts.push(e.institution, e.degree, e.field, e.description);
    });
  }
  if (Array.isArray(cvData.projects)) {
    cvData.projects.forEach((p: any) => {
      parts.push(p.name, p.description, ...(p.technologies || []));
    });
  }
  if (Array.isArray(cvData.skills)) {
    cvData.skills.forEach((s: any) => {
      parts.push(s.category, ...(s.skills || []));
    });
  }
  if (Array.isArray(cvData.certifications)) {
    cvData.certifications.forEach((c: any) => parts.push(c.name, c.issuer));
  }
  if (Array.isArray(cvData.languages)) {
    cvData.languages.forEach((l: any) => parts.push(l.language));
  }

  const fullCVText = parts.filter(Boolean).join(' ');
  const result = analyzeCVAgainstJD(fullCVText, jdText, cvData);

  return json({ result });
};
