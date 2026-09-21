import type { FC, MouseEvent } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { Team } from "@/lib/domain/types";

type TeamsListProps = {
  teams: Team[];
  memberSuffixSingular: string;
  memberSuffixPlural: string;
  viewLabel: string;
  onDeleteTeam?: (teamId: string) => void;
};

export const TeamsList: FC<TeamsListProps> = ({
  teams,
  memberSuffixSingular,
  memberSuffixPlural,
  viewLabel,
  onDeleteTeam,
}) => {
  return (
    <ul
      className="divide-y divide-border-subtle rounded-lg border border-border-subtle bg-background"
      data-testid="teams-list"
    >
      {teams.map((team) => (
        <li
          key={team.id}
          className="px-4 py-3 first:rounded-t-lg last:rounded-b-lg"
          data-testid={`team-list-item-${team.id}`}
        >
          <div className="flex items-center justify-between gap-2 rounded-md px-1 py-1 hover:bg-accent-soft">
            <Link
              href={`/teams/${team.id}`}
              className="flex flex-1 items-center justify-between gap-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="px-2">
                <p className="font-medium">{team.name}</p>
                <p className="mt-0.5 text-xs opacity-70">
                  {team.members.length}{" "}
                  {team.members.length === 1
                    ? memberSuffixSingular
                    : memberSuffixPlural}
                </p>
              </div>
              <span className="px-2 text-xs font-medium text-accent">
                {viewLabel}
              </span>
            </Link>

            {onDeleteTeam && (
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border-subtle bg-background text-xs text-danger shadow-sm hover:bg-danger-soft hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
                aria-label="Delete team"
                onClick={(event: MouseEvent<HTMLButtonElement>) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onDeleteTeam(team.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};
