import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import { teams as mockTeams } from "@/lib/domain/mockData";
import type { Team } from "@/lib/domain/types";
import { getCollectionWithId } from "@/lib/firebase/collections";
import { db } from "@/lib/firebase/firestore";

export const runtime = "nodejs";

export const GET = async () => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return NextResponse.json(mockTeams);
  }

  try {
    const teams = await getCollectionWithId<Team>("teams");

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error fetching teams from Firestore", error);
    return NextResponse.json(
      { error: "Failed to load teams" },
      { status: 500 },
    );
  }
};

export const POST = async (request: Request) => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return NextResponse.json(
      { error: "Firebase is not configured" },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as Partial<Team>;

    if (!body.name) {
      return NextResponse.json(
        { error: "Missing required field: name" },
        { status: 400 },
      );
    }

    const baseSlug = body.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const id = baseSlug || randomUUID();

    const newTeam: Team = {
      id,
      name: body.name,
      members: body.members ?? [],
    };

    const teamsRef = collection(db, "teams");
    const teamDocRef = doc(teamsRef, newTeam.id);

    await setDoc(teamDocRef, {
      name: newTeam.name,
      members: newTeam.members,
    });

    return NextResponse.json(newTeam, { status: 201 });
  } catch (error) {
    console.error("Error creating team in Firestore", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 },
    );
  }
};

export const DELETE = async (request: Request) => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return NextResponse.json(
      { error: "Firebase is not configured" },
      { status: 500 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing required query parameter: id" },
        { status: 400 },
      );
    }

    const teamsRef = collection(db, "teams");
    const teamDocRef = doc(teamsRef, id);

    await deleteDoc(teamDocRef);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting team from Firestore", error);
    return NextResponse.json(
      {
        error: "Failed to delete team",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
};

export const PUT = async (request: Request) => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return NextResponse.json(
      { error: "Firebase is not configured" },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as Partial<Team>;

    if (!body.id || !body.name) {
      return NextResponse.json(
        { error: "Missing required fields: id and name" },
        { status: 400 },
      );
    }

    const teamsRef = collection(db, "teams");
    const teamDocRef = doc(teamsRef, body.id);

    await setDoc(teamDocRef, { name: body.name }, { merge: true });

    return NextResponse.json({ id: body.id, name: body.name }, { status: 200 });
  } catch (error) {
    console.error("Error updating team in Firestore", error);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 },
    );
  }
};
