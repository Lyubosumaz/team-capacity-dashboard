"use client";

import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { getUpcomingRiskEvents } from "@/lib/domain/metrics";

export const UpcomingRiskEventsWidget: FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["upcoming-risk-events"],
    queryFn: async () => {
      const [teams, riskBundle] = await Promise.all([
        api.getTeams(),
        api.getRiskBundle(),
      ]);
      return { teams, events: riskBundle.events };
    },
  });

  if (isLoading) {
    return (
      <section
        className="space-y-2 text-xs opacity-80"
        data-testid="upcoming-risk-events-widget"
      >
        <p>Loading upcoming risk events…</p>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section
        className="space-y-2 text-xs opacity-80"
        data-testid="upcoming-risk-events-widget"
      >
        <p>Unable to load upcoming risk events right now.</p>
      </section>
    );
  }

  const events = getUpcomingRiskEvents(data.events, new Date(), 5);

  return (
    <section className="space-y-2" data-testid="upcoming-risk-events-widget">
      <h2
        id="upcoming-risk-events-heading"
        className="text-sm font-semibold uppercase tracking-wide opacity-70"
      >
        Upcoming risk events
      </h2>
      {events.length === 0 ? (
        <p className="text-xs opacity-80">
          No upcoming vacations or critical events.
        </p>
      ) : (
        <ul className="space-y-2 text-xs">
          {events.map((event) => {
            const team = data.teams.find((t) => t.id === event.teamId);
            return (
              <li
                key={event.id}
                className="rounded-md border border-border-subtle bg-background px-3 py-2"
              >
                <p className="font-medium text-accent">
                  {event.type === "vacation" && "Vacation"}
                  {event.type === "absence" && "Absence"}
                  {event.type === "key_person_unavailable" &&
                    "Key person unavailable"}
                  {team ? ` · ${team.name}` : null}
                </p>
                <p className="mt-0.5">
                  {event.description}
                  <span className="ml-1 opacity-70">({event.date})</span>
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
