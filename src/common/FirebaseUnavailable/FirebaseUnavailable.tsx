import type { FC } from "react";
import Link from "next/link";
import { TzarPageHeader } from "@tzardom-ui/react";

type FirebaseUnavailableProps = {
  // Optional context about which feature was requested, e.g. "Teams".
  feature?: string;
};

// Shown instead of crashing whenever a route needs Firebase (auth or
// Firestore) and no .env is configured on this machine. The homepage is the
// one exception — it falls back to mock data instead of showing this, see
// src/app/page.tsx.
export const FirebaseUnavailable: FC<FirebaseUnavailableProps> = ({
  feature,
}) => {
  return (
    <section
      className="flex w-full flex-col items-center justify-center gap-4 py-16 text-center"
      data-testid="firebase-unavailable"
    >
      <TzarPageHeader
        data-testid="no-firebase"
        title={
          feature
            ? `${feature} needs Firebase configured`
            : "This page needs Firebase configured"
        }
        description="No Firebase environment variables were found on this machine, so this page can't load real data. Copy example.env to .env and fill in your Firebase project's values, then restart the dev server."
      />
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-secondary-soft hover:bg-accent/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        data-testid="firebase-unavailable-home-link"
      >
        Back to overview
      </Link>
    </section>
  );
};
