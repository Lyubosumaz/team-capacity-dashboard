"use client";

import type { FC } from "react";

import { useLocalization } from "@/providers/LocalizationProvider";
import { KeyMetricsSection } from "../../common/KeyMetricsSection/KeyMetricsSection";
import { CapacityAndRiskWidgetsSection } from "../../common/CapacityAndRiskWidgetsSection/CapacityAndRiskWidgetsSection";
import { PageHeader } from "@/common/PageHeader/PageHeader";
import { ChartsSection } from "@/common/ChartsSection/ChartsSection";

type HomePageClientProps = {
  totalTeams: number;
  totalProjects: number;
  highRiskCount: number;
};

export const HomePageClient: FC<HomePageClientProps> = ({
  totalTeams,
  totalProjects,
  highRiskCount,
}) => {
  const { t } = useLocalization();

  const keyMetricsLabels = {
    section1: {
      label: t("home.keyMetricsSection.teams.label"),
      helperText: t("home.keyMetricsSection.teams.helperText"),
    },
    section2: {
      label: t("home.keyMetricsSection.projects.label"),
      helperText: t("home.keyMetricsSection.projects.helperText"),
    },
    section3: {
      label: t("home.keyMetricsSection.highRiskInsights.label"),
      helperText: t("home.keyMetricsSection.highRiskInsights.helperText"),
    },
  };

  const chartsTexts = {
    loading: t("teams.detail.chartsSection.loading"),
    error: t("teams.detail.chartsSection.error"),
    notFound: t("teams.detail.chartsSection.notFound"),
    noData: t("teams.detail.chartsSection.noData"),
    capacityOverTimeTitle: t(
      "teams.detail.chartsSection.capacityOverTimeTitle",
    ),
    workloadVsCapacityTitle: t(
      "teams.detail.chartsSection.workloadVsCapacityTitle",
    ),
    currentSprintFallback: t(
      "teams.detail.chartsSection.currentSprintFallback",
    ),
  };

  return (
    <section
      className="flex w-full flex-col gap-6"
      data-testid="home-overview-section"
    >
      <PageHeader
        title={t("home.overviewHeader.title")}
        description={t("home.overviewHeader.description")}
      />

      <KeyMetricsSection
        section1={totalTeams}
        section2={totalProjects}
        section3={highRiskCount}
        texts={keyMetricsLabels}
      />

      <CapacityAndRiskWidgetsSection />

      <ChartsSection
        teamId="team-alpha"
        withHeader={false}
        texts={chartsTexts}
      />
    </section>
  );
};
