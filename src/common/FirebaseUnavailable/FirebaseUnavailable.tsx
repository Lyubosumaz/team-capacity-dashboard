import type { FC } from "react";
import Link from "next/link";
import { TzarCommonLink, TzarPageHeader } from "@tzardom-ui/react";

type FirebaseUnavailableProps = {
  feature: string;
};

// Shown when a page needs Firebase but the .env has no Firebase keys.
export const FirebaseUnavailable: FC<FirebaseUnavailableProps> = ({
  feature,
}) => {
  return (
    <section
      data-testid="firebase-unavailable"
      className="flex w-full flex-col items-center justify-center gap-4 py-16 text-center"
    >
      <TzarPageHeader
        data-testid="firebase-unavailable-header"
        title={`${feature} needs Firebase configured`}
        description="No Firebase environment variables were found on this machine, so this page can't load real data. Copy example.env to .env and fill in your Firebase project's values, then restart the dev server."
      />
      <TzarCommonLink
        as={Link}
        href="/"
        variant="primary"
        data-testid="firebase-unavailable-home-link"
      >
        Back to overview
      </TzarCommonLink>
    </section>
  );
};
