import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FirebaseUnavailable } from '@/features/auth/FirebaseUnavailable';

describe('FirebaseUnavailable', () => {
  it('names the feature that needs Firebase', () => {
    render(<FirebaseUnavailable feature="Teams" />);

    expect(screen.getByTestId('firebase-unavailable-header')).toHaveTextContent(
      'Teams needs Firebase configured',
    );
  });
});
