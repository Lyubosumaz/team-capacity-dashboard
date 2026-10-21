import { NextResponse } from 'next/server';
import { projects as mockProjects } from '@/lib/domain/mockData';
import type { Project } from '@/lib/domain/types';
import { getCollectionWithId } from '@/lib/firebase/collections';

export const runtime = 'nodejs';

export const GET = async () => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return NextResponse.json(mockProjects);
  }

  try {
    const projects = await getCollectionWithId<Project>('projects');

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects from Firestore', error);
    return NextResponse.json(
      { error: 'Failed to load projects' },
      { status: 500 },
    );
  }
};
