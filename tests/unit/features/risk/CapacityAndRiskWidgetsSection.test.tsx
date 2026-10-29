import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CapacityAndRiskWidgetsSection } from '@/features/risk/CapacityAndRiskWidgetsSection';

describe('CapacityAndRiskWidgetsSection', () => {
  it('shows the teams over capacity and the upcoming events', () => {
    render(
      <CapacityAndRiskWidgetsSection
        overCapacityTeams={[
          { id: 'team-1', name: 'Mock Team', workload: 15, capacity: 10 },
        ]}
        upcomingEvents={[
          {
            id: 'event-1',
            label: 'Mock vacation',
            description: 'Mock person is off',
            date: '2026-11-02',
          },
        ]}
      />,
    );

    expect(screen.getByTestId('teams-over-capacity')).toHaveTextContent(
      'Mock Team',
    );
    expect(screen.getByTestId('upcoming-risk-events')).toHaveTextContent(
      'Mock vacation',
    );
  });
});
