import { FC } from "react";
import { ChartsSectionTexts } from "./ChartsSection";
import { PageHeader } from "../PageHeader/PageHeader";

export const ChartsSectionLayout: FC<{
  texts?: ChartsSectionTexts;
  message?: string;
}> = ({ texts, message }) => {
  return (
    <section
      className="rounded-lg border border-border-subtle bg-background p-4 shadow-sm"
      data-testid="charts-section"
    >
      {texts?.heading && texts?.description ? (
        <PageHeader
          title={texts.heading}
          description={texts.description}
          as="h2"
        />
      ) : null}
      {message ? <p className="mt-2 text-sm opacity-80">{message}</p> : null}
    </section>
  );
};
