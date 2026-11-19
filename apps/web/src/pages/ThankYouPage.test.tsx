import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { routerFuture } from '../routerFuture';
import { ThankYouPage } from './ThankYouPage';

describe('ThankYouPage', () => {
  it('shows thank you message', () => {
    render(
      <MemoryRouter future={routerFuture}>
        <ThankYouPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Thank you')).toBeInTheDocument();
  });
});
