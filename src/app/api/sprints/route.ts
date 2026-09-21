import { NextResponse } from "next/server";
import { sprints as mockSprints } from "@/lib/domain/mockData";
import type { Sprint } from "@/lib/domain/types";
import { getCollectionWithId } from "@/lib/firebase/collections";

export const runtime = "nodejs";

export const GET = async () => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return NextResponse.json(mockSprints);
  }

  try {
    const sprints = await getCollectionWithId<Sprint>("sprints");

    return NextResponse.json(sprints);
  } catch (error) {
    console.error("Error fetching sprints from Firestore", error);
    return NextResponse.json(
      { error: "Failed to load sprints" },
      { status: 500 },
    );
  }
};
