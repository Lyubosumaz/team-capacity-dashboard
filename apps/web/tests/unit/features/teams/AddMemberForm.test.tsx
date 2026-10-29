import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addMember } from '@/features/teams/actions';
import { AddMemberForm } from '@/features/teams/AddMemberForm';

vi.mock('@/features/teams/actions', () => ({ addMember: vi.fn() }));

const ACCOUNTS = [
  { id: 'maria', email: 'maria@example.com' },
  { id: 'ivan', email: 'ivan@example.com' },
];

const fillIn = (label: string, value: string) => {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
};

const fillInMaria = () => {
  fillIn('Account', 'maria');
  fillIn('Role', 'Designer');
  fillIn('Capacity per sprint', '8');
};

beforeEach(() => {
  vi.mocked(addMember).mockReset();
});

describe('AddMemberForm', () => {
  it('lists the accounts to choose from', () => {
    render(<AddMemberForm teamId="team-1" accounts={ACCOUNTS} />);

    expect(
      screen.getByRole('option', { name: 'maria@example.com' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'ivan@example.com' }),
    ).toBeInTheDocument();
  });

  it('sends the chosen account and clears the form', async () => {
    vi.mocked(addMember).mockResolvedValue({});
    render(<AddMemberForm teamId="team-1" accounts={ACCOUNTS} />);

    fillInMaria();
    fireEvent.click(screen.getByLabelText('Key person'));
    fireEvent.click(screen.getByRole('button', { name: 'Add member' }));

    await waitFor(() =>
      expect(addMember).toHaveBeenCalledWith('team-1', 'maria', {
        role: 'Designer',
        capacityPerSprint: 8,
        isKeyPerson: true,
      }),
    );
    await waitFor(() =>
      expect(screen.getByLabelText('Account')).toHaveValue(''),
    );
  });

  it('shows the error the server sends back', async () => {
    vi.mocked(addMember).mockResolvedValue({
      error: 'This person is already in the team.',
    });
    render(<AddMemberForm teamId="team-1" accounts={ACCOUNTS} />);

    fillInMaria();
    fireEvent.click(screen.getByRole('button', { name: 'Add member' }));

    expect(
      await screen.findByText('This person is already in the team.'),
    ).toBeInTheDocument();
  });

  it('says so when everyone is already in the team', () => {
    render(<AddMemberForm teamId="team-1" accounts={[]} />);

    expect(
      screen.getByText(/everyone with an account is already in this team/i),
    ).toBeInTheDocument();
  });
});
