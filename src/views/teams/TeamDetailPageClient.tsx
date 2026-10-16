"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import type { Team, Project, RiskInsight } from "@/lib/domain/types";
import { useLocalization } from "@/providers/LocalizationProvider";
import { TeamMembersSection } from "./TeamMembersSection";
import { TeamProjectsAndRisksSection } from "./TeamProjectsAndRisksSection";
import { ChartsSection } from "@/components/widgets/ChartsSection/ChartsSection";
import { TzarButton, TzarDialog, TzarTextField } from "@tzardom-ui/react";

type TeamDetailPageClientProps = {
  team: Team;
  projects: Project[];
  risks: RiskInsight[];
  totalCapacity: number;
};

export const TeamDetailPageClient = ({
  team,
  projects,
  risks,
  totalCapacity,
}: TeamDetailPageClientProps) => {
  const { t } = useLocalization();
  const [teamName, setTeamName] = useState(team.name);
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [editNameValue, setEditNameValue] = useState(team.name);
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [editNameError, setEditNameError] = useState<string | null>(null);

  const membersTexts = {
    heading: t("teams.detail.membersSection.heading"),
    nameColumn: t("teams.detail.membersSection.nameColumn"),
    roleColumn: t("teams.detail.membersSection.roleColumn"),
    skillsColumn: t("teams.detail.membersSection.skillsColumn"),
    capacityPerSprintColumn: t(
      "teams.detail.membersSection.capacityPerSprintColumn",
    ),
    totalCapacityRow: t("teams.detail.membersSection.totalCapacityRow"),
    keyBadge: t("teams.detail.membersSection.keyBadge"),
    noSkillsPlaceholder: t("teams.detail.membersSection.noSkillsPlaceholder"),
  };

  const projectsAndRisksTexts = {
    heading: t("teams.detail.projectsAndRisksSection.heading"),
    projectsHeading: t("teams.detail.projectsAndRisksSection.projectsHeading"),
    projectsEmpty: t("teams.detail.projectsAndRisksSection.projectsEmpty"),
    risksHeading: t("teams.detail.projectsAndRisksSection.risksHeading"),
    risksEmpty: t("teams.detail.projectsAndRisksSection.risksEmpty"),
  };

  const chartsTexts = {
    heading: t("teams.detail.chartsSection.heading"),
    description: t("teams.detail.chartsSection.description"),
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
    <section className="flex w-full flex-col gap-6">
      <header className="space-y-2 pb-10">
        <div className="flex items-center justify-between gap-3">
          <h1
            data-testid="team-detail-name"
            className="text-2xl font-semibold tracking-tight"
          >
            {teamName}
          </h1>
          <TzarButton
            data-testid="team-detail-edit-button"
            onClick={() => {
              setEditNameError(null);
              setEditNameValue(teamName);
              setIsEditNameModalOpen(true);
            }}
          >
            Edit name
          </TzarButton>
        </div>
        <p className="max-w-2xl text-sm opacity-80">
          {t("teams.detail.pageDescription")}
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
        <TeamMembersSection
          team={team}
          totalCapacity={totalCapacity}
          texts={membersTexts}
        />

        <TeamProjectsAndRisksSection
          projects={projects}
          risks={risks}
          texts={projectsAndRisksTexts}
        />
      </div>

      <ChartsSection teamId={team.id} texts={chartsTexts} />

      <TzarDialog
        data-testid="team-detail-edit-dialog"
        open={isEditNameModalOpen}
        onClose={() => {
          setIsEditNameModalOpen(false);
          setEditNameError(null);
          setEditNameValue(teamName);
        }}
        title="Edit team name"
        confirmLabel={isUpdatingName ? "Saving..." : "Save"}
        confirmDisabled={isUpdatingName}
        form="edit-team-name-form"
      >
        <form
          data-testid="team-detail-edit-form"
          id="edit-team-name-form"
          className="space-y-3"
          onSubmit={async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const trimmedName = editNameValue.trim();

            if (!trimmedName) {
              setEditNameError("Team name is required");
              return;
            }

            try {
              setIsUpdatingName(true);
              setEditNameError(null);

              const response = await fetch("/api/teams", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: team.id, name: trimmedName }),
              });

              if (!response.ok) {
                setEditNameError(
                  "Failed to update team name. Please try again.",
                );
                return;
              }

              setTeamName(trimmedName);
              setIsEditNameModalOpen(false);
            } catch (error) {
              console.error("Error updating team name", error);
              setEditNameError("Failed to update team name. Please try again.");
            } finally {
              setIsUpdatingName(false);
            }
          }}
        >
          <TzarTextField
            data-testid="team-detail-name-input"
            label="Team name"
            value={editNameValue}
            onChange={(event) => setEditNameValue(event.target.value)}
          />

          {editNameError ? (
            <p
              data-testid="team-detail-edit-error"
              className="text-xs text-danger"
            >
              {editNameError}
            </p>
          ) : null}
        </form>
      </TzarDialog>
    </section>
  );
};
