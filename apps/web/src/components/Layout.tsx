import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { apiGet } from '../api/client';
import type { User } from '../types';
import { SearchBar } from './SearchBar';

interface Props {
  user: User | null;
  onLogout: () => Promise<void>;
}

export function Layout({ user, onLogout }: Props) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    void apiGet<string[]>('/api/categories')
      .then((cats) => {
        if (!cancelled) setCategories(cats);
      })
      .catch(() => {
        /* non-blocking */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-main">
          <Link to="/" className="brand" aria-label="Linecard home">
            Linecard
          </Link>
          <SearchBar variant="header" />
          <div className="header-account">
            <NavLink to="/catalogue-ask" className="account-link">
              <span className="account-label">Ask</span>
              <span className="account-value">Catalogue</span>
            </NavLink>
            {user ? (
              <div className="account-block">
                <span className="account-label">Hello, {user.email.split('@')[0]}</span>
                <button type="button" className="account-action" onClick={() => void onLogout()}>
                  Sign out
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="account-link">
                <span className="account-label">Hello, sign in</span>
                <span className="account-value">Account</span>
              </NavLink>
            )}
          </div>
        </div>
        <div className="category-strip-bar">
          <nav className="category-strip" aria-label="Shop by category">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
              All
            </NavLink>
            {categories.map((category) => (
              <NavLink
                key={category}
                to={`/categories/${encodeURIComponent(category)}`}
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                {category}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand-row">
            <Link to="/" className="brand footer-brand">
              Linecard
            </Link>
            <p className="footer-tagline">Catalogue intelligence for sales teams</p>
          </div>
          <div className="footer-links">
            <Link to="/">Top rated</Link>
            <Link to="/catalogue-ask">Ask the catalogue</Link>
            <Link to="/login">Account</Link>
          </div>
          <p className="footer-copy">
            Browse products, ask grounded questions, and send sales enquiries.
          </p>
        </div>
      </footer>
    </div>
  );
}
