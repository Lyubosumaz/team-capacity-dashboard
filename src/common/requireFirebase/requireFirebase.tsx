import type { ReactNode } from "react";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { FirebaseUnavailable } from "@/common/FirebaseUnavailable/FirebaseUnavailable";

/**
 * Server-side guard for pages that fetch Firebase data on the server
 * (teams, teams/[id], risk). Pages that only render client UI should use
 * `<FirebaseGate>` instead (see src/common/FirebaseGate).
 *
 * Sync guard for pages that need Firebase. Call it first thing in a page
 * component; if it returns non-null, return that instead of your real
 * content — Firebase isn't configured (no .env locally), so nothing else
 * should attempt a Firestore/Auth call.
 *
 *   const TeamsPage = async () => {
 *     const unavailable = requireFirebase("Teams");
 *     if (unavailable) return unavailable;
 *     const teams = await getCollectionWithId<Team>("teams");
 *     return <TeamsPageClient teams={teams} />;
 *   };
 *
 * Kept synchronous on purpose: a page that doesn't otherwise fetch data can
 * stay a plain sync component, which keeps it renderable directly with
 * @testing-library/react — that library can't render an async Server
 * Component at all (that's what broke login/register's tests when this
 * guard was previously bundled into an async wrapper).
 *
 * For a page that already awaits data (teams/[id], say) and needs a 404
 * when a doc doesn't exist, just call Next's own `notFound()` inline after
 * this guard — it's a one-liner, not worth wrapping further.
 */
export const requireFirebase = (feature: string): ReactNode | null => {
  if (isFirebaseConfigured) {
    return null;
  }

  return <FirebaseUnavailable feature={feature} />;
};
