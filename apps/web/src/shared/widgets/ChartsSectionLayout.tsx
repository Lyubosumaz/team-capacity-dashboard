import { TzarPageHeader } from '@tzardom-ui/react';
import type { ChartsSectionLayoutProps } from './ChartsSection.types';

export const ChartsSectionLayout = ({
  texts,
  message,
}: ChartsSectionLayoutProps) => {
  return (
    <section
      className="rounded-lg border border-border-subtle bg-background p-4 shadow-sm"
      data-testid="charts-section"
    >
      {texts?.heading && texts?.description ? (
        <TzarPageHeader
          data-testid="charts-section-header"
          title={texts.heading}
          description={texts.description}
          as="h2"
        />
      ) : null}
      {message ? (
        <p
          className="mt-2 text-sm opacity-80"
          data-testid="charts-section-message"
        >
          {message}
        </p>
      ) : null}
    </section>
  );
};
