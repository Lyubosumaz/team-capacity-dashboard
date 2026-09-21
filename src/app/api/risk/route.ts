import { NextResponse } from "next/server";
import {
  riskRules as mockRiskRules,
  riskInsights as mockRiskInsights,
  riskEvents as mockRiskEvents,
} from "@/lib/domain/mockData";
import type { RiskRule, RiskInsight, RiskEvent } from "@/lib/domain/types";
import { getCollectionWithId } from "@/lib/firebase/collections";

export const runtime = "nodejs";

export const GET = async () => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return NextResponse.json({
      rules: mockRiskRules,
      insights: mockRiskInsights,
      events: mockRiskEvents,
    });
  }

  try {
    const [rules, insights, events] = await Promise.all([
      getCollectionWithId<RiskRule>("riskRules"),
      getCollectionWithId<RiskInsight>("riskInsights"),
      getCollectionWithId<RiskEvent>("riskEvents"),
    ]);

    return NextResponse.json({ rules, insights, events });
  } catch (error) {
    console.error("Error fetching risk data from Firestore", error);
    return NextResponse.json(
      { error: "Failed to load risk data" },
      { status: 500 },
    );
  }
};
