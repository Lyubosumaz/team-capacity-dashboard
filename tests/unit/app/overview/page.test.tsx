import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/widgets/ChartsSection', () => ({
  ChartsSection: () => <div data-testid="charts-section" />,
}));

import { TestProviders } from '@tests/TestProviders';
import { OverviewView } from '@/features/overview/OverviewView';
import {
  projects as mockProjects,
  riskInsights as mockRiskInsights,
  sprints as mockSprints,
  teams as mockTeams,
} from '@tests/mockData';

describe('Overview page', () => {
  it('renders overview heading and key sections', () => {
    const totalTeams = mockTeams.length;
    const totalProjects = mockProjects.length;
    const highRiskCount = mockRiskInsights.filter(
      (insight) => insight.severity === 'high',
    ).length;

    render(
      <TestProviders>
        <OverviewView
          totalTeams={totalTeams}
          totalProjects={totalProjects}
          highRiskCount={highRiskCount}
          overCapacityTeams={[]}
          upcomingEvents={[]}
          chartTeam={mockTeams[0]}
          sprints={mockSprints}
          projects={mockProjects}
        />
      </TestProviders>,
    );

    expect(screen.getByTestId('home-overview-section')).toBeInTheDocument();
    expect(screen.getByTestId('key-metrics-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('capacity-and-risk-widgets')).toBeInTheDocument();
    expect(screen.getByTestId('charts-section')).toBeInTheDocument();
  });
});
