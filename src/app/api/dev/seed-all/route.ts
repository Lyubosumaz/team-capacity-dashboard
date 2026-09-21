import { NextResponse } from "next/server";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import {
  skills,
  teams,
  sprints,
  projects,
  riskRules,
  riskInsights,
  riskEvents,
} from "@/lib/domain/mockData";

// Without this line, Next.js might try to run the route on the Edge (depending on config/version),
// which can cause subtle or hard errors with Firebase.
// Keeping it forces a safe, compatible environment for your Firebase-backed API routes.
export const runtime = "nodejs";

// Dev-only endpoint to populate Firestore with all mock domain data.
// Call once locally: POST /api/dev/seed-all
export const POST = async () => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return NextResponse.json(
      { error: "Firebase is not configured (missing project ID)." },
      { status: 400 },
    );
  }

  const stripMockPrefix = (value: unknown): unknown => {
    if (typeof value === "string" && value.startsWith("mock_")) {
      return value.slice("mock_".length);
    }
    return value;
  };

  const stripMockPrefixesFromObject = (
    obj: Record<string, unknown>,
  ): Record<string, unknown> => {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string") {
        result[key] = stripMockPrefix(value);
      } else if (value && typeof value === "object" && !Array.isArray(value)) {
        result[key] = stripMockPrefixesFromObject(
          value as Record<string, unknown>,
        );
      } else if (Array.isArray(value)) {
        result[key] = value.map((item) => {
          if (typeof item === "string") return stripMockPrefix(item);
          if (item && typeof item === "object") {
            return stripMockPrefixesFromObject(item as Record<string, unknown>);
          }
          return item;
        });
      } else {
        result[key] = value;
      }
    }

    return result;
  };

  const seedCollection = <T extends { id: string }>(
    collectionName: string,
    items: readonly T[],
  ) => {
    return items.map((item) => {
      const ref = doc(collection(db, collectionName), item.id);
      const { ...data } = item;
      const cleaned = stripMockPrefixesFromObject(
        data as Record<string, unknown>,
      );
      return setDoc(ref, cleaned, { merge: true });
    });
  };

  try {
    const promises = [
      ...seedCollection("skills", skills),
      ...seedCollection("teams", teams),
      ...seedCollection("sprints", sprints),
      ...seedCollection("projects", projects),
      ...seedCollection("riskRules", riskRules),
      ...seedCollection("riskInsights", riskInsights),
      ...seedCollection("riskEvents", riskEvents),
    ];

    await Promise.all(promises);

    return NextResponse.json({
      ok: true,
      counts: {
        skills: skills.length,
        teams: teams.length,
        sprints: sprints.length,
        projects: projects.length,
        riskRules: riskRules.length,
        riskInsights: riskInsights.length,
        riskEvents: riskEvents.length,
      },
    });
  } catch (error) {
    console.error("Error seeding all mock data to Firestore", error);
    return NextResponse.json(
      { error: "Failed to seed all mock data" },
      { status: 500 },
    );
  }
};
