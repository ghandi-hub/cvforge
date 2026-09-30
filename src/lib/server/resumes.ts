import { getDb } from '$lib/server/db';
import { ObjectId } from 'mongodb';
import { type Resume, ResumeSchema } from '$lib/types/cv';

export async function getUserResumes(userId: string): Promise<any[]> {
  const db = await getDb();
  const docs = await db
    .collection('resumes')
    .find({ userId })
    .sort({ updatedAt: -1 })
    .toArray();

  return docs.map((doc) => ({
    id: doc._id.toString(),
    userId: doc.userId,
    title: doc.title,
    template: doc.template,
    sectionOrder: doc.sectionOrder,
    data: doc.data,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  }));
}

export async function getResumeById(id: string, userId: string): Promise<any | null> {
  if (!/^[a-f0-9]{24}$/i.test(id)) return null;

  const db = await getDb();
  const doc = await db.collection('resumes').findOne({
    _id: new ObjectId(id),
    userId
  });

  if (!doc) return null;

  return {
    id: doc._id.toString(),
    userId: doc.userId,
    title: doc.title,
    template: doc.template,
    sectionOrder: doc.sectionOrder,
    data: doc.data,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

export async function createResume(userId: string, title = 'Untitled CV'): Promise<any> {
  const db = await getDb();
  const now = new Date();

  const newDoc = {
    userId,
    title,
    template: 'ats-classic',
    sectionOrder: [
      'experience',
      'education',
      'skills',
      'projects',
      'certifications',
      'languages'
    ],
    data: {
      basics: {
        name: '',
        headline: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        github: ''
      },
      summary: '',
      experience: [],
      education: [],
      projects: [],
      skills: [],
      certifications: [],
      languages: []
    },
    createdAt: now,
    updatedAt: now
  };

  const res = await db.collection('resumes').insertOne(newDoc);
  return {
    ...newDoc,
    id: res.insertedId.toString()
  };
}

export async function updateResume(id: string, userId: string, updates: Partial<Resume>): Promise<any | null> {
  if (!/^[a-f0-9]{24}$/i.test(id)) return null;

  const db = await getDb();
  const cleanUpdates = {
    ...updates,
    updatedAt: new Date()
  };
  delete (cleanUpdates as any).id;
  delete (cleanUpdates as any)._id;
  delete (cleanUpdates as any).userId;

  const res = await db.collection('resumes').findOneAndUpdate(
    { _id: new ObjectId(id), userId },
    { $set: cleanUpdates },
    { returnDocument: 'after' }
  );

  if (!res) return null;
  return {
    id: res._id.toString(),
    userId: res.userId,
    title: res.title,
    template: res.template,
    sectionOrder: res.sectionOrder,
    data: res.data,
    createdAt: res.createdAt,
    updatedAt: res.updatedAt
  };
}

export async function duplicateResume(id: string, userId: string): Promise<any | null> {
  const original = await getResumeById(id, userId);
  if (!original) return null;

  const db = await getDb();
  const now = new Date();
  const copyDoc = {
    userId,
    title: `${original.title} (Copy)`,
    template: original.template,
    sectionOrder: original.sectionOrder,
    data: original.data,
    createdAt: now,
    updatedAt: now
  };

  const res = await db.collection('resumes').insertOne(copyDoc);
  return {
    ...copyDoc,
    id: res.insertedId.toString()
  };
}

export async function deleteResume(id: string, userId: string): Promise<boolean> {
  if (!/^[a-f0-9]{24}$/i.test(id)) return false;

  const db = await getDb();
  const res = await db.collection('resumes').deleteOne({
    _id: new ObjectId(id),
    userId
  });

  return res.deletedCount > 0;
}
