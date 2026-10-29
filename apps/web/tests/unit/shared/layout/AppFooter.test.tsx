import { render, screen } from '@testing-library/react';
import { TestProviders } from '@tests/TestProviders';
import { describe, expect, it } from 'vitest';
import { AppFooter } from '@/shared/layout/AppFooter';

describe('AppFooter', () => {
  it('renders current year, app name, and tech stack', () => {
    render(
      <TestProviders>
        <AppFooter />
      </TestProviders>,
    );

    const year = new Date().getFullYear();

    const footer = screen.getByTestId('app-footer');

    expect(footer).toHaveTextContent(
      new RegExp(`©\\s*${year}\\s*lyubosumaz-projects`, 'i'),
    );
    expect(footer).toHaveTextContent(/team capacity dashboard/i);
    expect(footer).toHaveTextContent(/built with next.js & tailwind css/i);
  });
});
