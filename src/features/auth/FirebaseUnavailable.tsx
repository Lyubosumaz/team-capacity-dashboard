import { TzarPageHeader } from '@tzardom-ui/react';
import type { FirebaseUnavailableProps } from './FirebaseUnavailable.types';

// Shown on login and sign-up when the NEXT_PUBLIC_FIREBASE_ keys are missing.
// That only happens while setting up the project, so it has no buttons.
export const FirebaseUnavailable = ({ feature }: FirebaseUnavailableProps) => (
  <section
    data-testid="firebase-unavailable"
    className="flex w-full flex-col items-center justify-center gap-4 py-16 text-center"
  >
    <TzarPageHeader
      data-testid="firebase-unavailable-header"
      title={`${feature} needs Firebase configured`}
      description="The NEXT_PUBLIC_FIREBASE_ keys are missing from local.env, so you can't sign up or log in yet. Fill them in from example.env, then restart the dev server."
    />
  </section>
);
