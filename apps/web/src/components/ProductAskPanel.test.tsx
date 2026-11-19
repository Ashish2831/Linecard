import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { routerFuture } from '../routerFuture';
import { ProductAskPanel } from './ProductAskPanel';

describe('ProductAskPanel', () => {
  it('prompts login when anonymous', () => {
    render(
      <MemoryRouter future={routerFuture}>
        <ProductAskPanel productId="1" isAuthenticated={false} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
  });
});
