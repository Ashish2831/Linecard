import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { routerFuture } from '../routerFuture';
import { HomePage } from './HomePage';

vi.mock('../api/client', () => ({
  apiGet: vi.fn(),
}));

import { apiGet } from '../api/client';

describe('HomePage', () => {
  beforeEach(() => {
    vi.mocked(apiGet).mockImplementation(async (path: string) => {
      if (path === '/api/products/featured') {
        return [
          {
            id: '1',
            title: 'Featured One',
            price: 12,
            description: 'd',
            category: 'electronics',
            image: 'https://example.com/1.png',
            rating: { rate: 5, count: 10 },
          },
        ];
      }
      if (path.startsWith('/api/products?')) {
        return {
          data: [
            {
              id: '1',
              title: 'Featured One',
              price: 12,
              description: 'd',
              category: 'electronics',
              image: 'https://example.com/1.png',
              rating: { rate: 5, count: 10 },
            },
            {
              id: '2',
              title: 'Catalogue Two',
              price: 20,
              description: 'd',
              category: 'jewelery',
              image: 'https://example.com/2.png',
              rating: { rate: 4, count: 8 },
            },
          ],
          total: 2,
          page: 1,
          pageSize: 100,
        };
      }
      if (path === '/api/categories') {
        return ['electronics'];
      }
      return [];
    });
  });

  it('renders featured product tiles', async () => {
    render(
      <MemoryRouter future={routerFuture}>
        <HomePage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Featured One')).toBeInTheDocument();
    });
    expect(screen.getByText('Top rated')).toBeInTheDocument();
    expect(screen.getByText('All products')).toBeInTheDocument();
    expect(screen.getByText('Catalogue Two')).toBeInTheDocument();
  });
});
