import { render, screen } from '@testing-library/react';
import { TestProviders } from '@tests/TestProviders';
import { describe, expect, it } from 'vitest';
import { RiskView } from '@/features/risk/RiskView';
import {
  getOverCapacityItems,
  getUpcomingEventItems,
} from '@/features/risk/riskWidgets';
import { getUpcomingRiskEvents } from '@/lib/domain/metrics';
import {
  projects as mockProjects,
  riskEvents as mockRiskEvents,
  riskInsights as mockRiskInsights,
  riskRules as mockRiskRules,
  sprints as mockSprints,
  teams as mockTeams,
} from '@tests/mockData';

describe('Risk page', () => {
  it('renders risk overview heading and key sections', () => {
    const highRiskInsights = mockRiskInsights.filter(
      (insight) => insight.severity === 'high',
    );

    const highRiskTeamsCount = new Set(
      highRiskInsights
        .map((insight) => insight.teamId)
        .filter((id): id is string => Boolean(id)),
    ).size;

    const upcomingEvents = getUpcomingRiskEvents(
      mockRiskEvents,
      new Date(),
      50,
    );

    const overCapacityTeams = getOverCapacityItems(
      mockTeams,
      mockProjects,
      mockSprints,
    );

    const upcomingEventItems = getUpcomingEventItems(mockRiskEvents, mockTeams);

    render(
      <TestProviders>
        <RiskView
          highRiskInsightsCount={highRiskInsights.length}
          highRiskTeamsCount={highRiskTeamsCount}
          upcomingEventsCount={upcomingEvents.length}
          insights={mockRiskInsights}
          rules={mockRiskRules}
          teams={mockTeams}
          overCapacityTeams={overCapacityTeams}
          upcomingEvents={upcomingEventItems}
        />
      </TestProviders>,
    );

    expect(screen.getByTestId('risk-header')).toHaveTextContent(
      /risk overview/i,
    );
    expect(screen.getByTestId('key-metrics-card-1')).toHaveTextContent(
      /high-risk insights/i,
    );
    expect(screen.getByTestId('capacity-and-risk-widgets')).toBeInTheDocument();
    expect(screen.getByTestId('teams-over-capacity')).toHaveTextContent(
      'Teams over capacity this sprint',
    );
    expect(screen.getByTestId('upcoming-risk-events')).toHaveTextContent(
      'Upcoming risk events',
    );
    expect(screen.getByTestId('risk-insights-list')).toBeInTheDocument();
  });
});
