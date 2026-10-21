import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TeamsView } from '@/features/teams/TeamsView';
import { teams as mockTeams } from '@/lib/domain/mockData';
import { Providers } from '@/shared/providers/Providers';

vi.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ href, children, ...rest }: any) => (
      <a href={href} {...rest}>
        {children}
      </a>
    ),
  };
});

describe('TeamsPage', () => {
  it('renders teams heading and list', () => {
    render(
      <Providers>
        <TeamsView teams={mockTeams} />
      </Providers>,
    );

    expect(screen.getByTestId('teams-header')).toHaveTextContent(/teams/i);
    expect(screen.getByTestId('team-name-team-alpha')).toHaveTextContent(
      /team alpha/i,
    );
  });
});
