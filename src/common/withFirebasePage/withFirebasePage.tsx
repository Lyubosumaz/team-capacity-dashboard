import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { FirebaseUnavailable } from "@/common/FirebaseUnavailable/FirebaseUnavailable";

type Render = () => Promise<ReactNode | null | undefined>;

/**
 * Shared guard for server-component pages that need Firebase.
 *
 * - If Firebase isn't configured (no .env locally), renders the
 *   `FirebaseUnavailable` page instead of calling `render` at all, so no
 *   page ever attempts a Firestore/Auth call without credentials.
 * - Otherwise calls `render`. Return `null`/`undefined` from it (e.g. a
 *   Firestore doc that doesn't exist) and this triggers Next's `notFound()`
 *   for you, same as calling `notFound()` yourself — pick whichever reads
 *   better at the call site.
 *
 * Usage:
 *   const TeamsPage = async () => withFirebasePage("Teams", async () => {
 *     const teams = await getCollectionWithId<Team>("teams");
 *     return <TeamsPageClient teams={teams} />;
 *   });
 */
export const withFirebasePage = async (
  feature: string,
  render: Render,
): Promise<ReactNode> => {
  if (!isFirebaseConfigured) {
    return <FirebaseUnavailable feature={feature} />;
  }

  const result = await render();

  if (result === null || result === undefined) {
    notFound();
  }

  return result;
};
