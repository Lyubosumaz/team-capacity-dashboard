"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Team } from "@/lib/domain/types";
import { useLocalization } from "@/providers/LocalizationProvider";
import { TeamsList } from "./TeamsList";
import {
  TzarButton,
  TzarDialog,
  TzarPageHeader,
  TzarTextField,
} from "@tzardom-ui/react";

type TeamsPageClientProps = {
  teams: Team[];
};

export const TeamsPageClient = ({ teams }: TeamsPageClientProps) => {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedMembersTeamIds, setSelectedMembersTeamIds] = useState<
    string[]
  >([]);
  const [teamIdPendingDelete, setTeamIdPendingDelete] = useState<string | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { t } = useLocalization();

  const memberSuffixSingular = t("teams.list.membersSuffixSingular");
  const memberSuffixPlural = t("teams.list.membersSuffixPlural");
  const viewLabel = t("teams.list.viewLabel");

  const handleDeleteTeam = (teamId: string) => {
    setTeamIdPendingDelete(teamId);
  };

  const confirmDeleteTeam = async () => {
    if (!teamIdPendingDelete) return;

    try {
      const response = await fetch(
        `/api/teams?id=${encodeURIComponent(teamIdPendingDelete)}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok && response.status !== 204) {
        console.error("Failed to delete team");
        return;
      }

      setTeamIdPendingDelete(null);
      router.refresh();
    } catch (error) {
      console.error("Error deleting team", error);
    }
  };

  return (
    <section className="flex w-full flex-col gap-4">
      <TzarPageHeader
        data-testid="teams-header"
        title={t("teams.overviewHeader.title")}
        description={t("teams.overviewHeader.description")}
      />

      <div className="flex justify-end">
        <TzarButton
          data-testid="teams-add-button"
          className="h-9"
          onClick={() => {
            setSubmitError(null);
            setNewTeamName("");
            setSelectedMembersTeamIds([]);
            setIsAddModalOpen(true);
          }}
        >
          Add team
          <Plus className="h-4 w-4" aria-hidden="true" />
        </TzarButton>
      </div>

      <TzarDialog
        data-testid="teams-add-dialog"
        open={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setNewTeamName("");
          setSubmitError(null);
          setSelectedMembersTeamIds([]);
        }}
        title="Add team"
        size="lg"
        confirmLabel={isSubmitting ? "Adding..." : "Add"}
        confirmDisabled={isSubmitting}
        form="add-team-form"
      >
        <form
          data-testid="teams-add-form"
          id="add-team-form"
          className="space-y-3"
          onSubmit={async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const trimmedName = newTeamName.trim();

            if (!trimmedName) {
              setSubmitError("Team name is required");
              return;
            }

            try {
              setIsSubmitting(true);
              setSubmitError(null);

              const response = await fetch("/api/teams", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: trimmedName,
                  members:
                    selectedMembersTeamIds.length > 0
                      ? (() => {
                          const combined = teams
                            .filter((team) =>
                              selectedMembersTeamIds.includes(team.id),
                            )
                            .flatMap((team) => team.members);

                          const seen = new Set<string>();
                          return combined.filter((member) => {
                            if (seen.has(member.id)) return false;
                            seen.add(member.id);
                            return true;
                          });
                        })()
                      : [],
                }),
              });

              if (!response.ok) {
                setSubmitError("Failed to add team. Please try again.");
                return;
              }

              setIsAddModalOpen(false);
              setNewTeamName("");
              setSubmitError(null);
              setSelectedMembersTeamIds([]);
              router.refresh();
            } catch (error) {
              console.error("Error adding team", error);
              setSubmitError("Failed to add team. Please try again.");
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <TzarTextField
            data-testid="teams-add-name"
            label="Team name"
            value={newTeamName}
            onChange={(event) => setNewTeamName(event.target.value)}
            placeholder="Enter team name"
          />

          <label className="block text-xs font-medium">
            Members
            <select
              className="mt-1 w-full rounded-md border border-border-subtle bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              multiple
              value={selectedMembersTeamIds}
              onChange={(event) =>
                setSelectedMembersTeamIds(
                  Array.from(
                    event.target.selectedOptions,
                    (option) => option.value,
                  ),
                )
              }
            >
              <option value="">No members (empty team)</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  Copy members from {team.name}
                </option>
              ))}
            </select>
          </label>

          {submitError ? (
            <p data-testid="teams-add-error" className="text-xs text-danger">
              {submitError}
            </p>
          ) : null}
        </form>
      </TzarDialog>

      <TzarDialog
        data-testid="teams-delete-dialog"
        open={teamIdPendingDelete !== null}
        onClose={() => {
          setTeamIdPendingDelete(null);
        }}
        title="Delete team"
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={confirmDeleteTeam}
      >
        <p className="text-xs opacity-80">
          Are you sure you want to delete this team? This action cannot be
          undone.
        </p>
      </TzarDialog>

      <TeamsList
        teams={teams}
        memberSuffixSingular={memberSuffixSingular}
        memberSuffixPlural={memberSuffixPlural}
        viewLabel={viewLabel}
        onDeleteTeam={handleDeleteTeam}
      />
    </section>
  );
};
