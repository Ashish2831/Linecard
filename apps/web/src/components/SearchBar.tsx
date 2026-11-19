import { FormEvent, KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiGet } from '../api/client';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import type { PagedResult, Product } from '../types';

const SUGGESTION_LIMIT = 6;

export function SearchBar({
  initial = '',
  variant = 'page',
}: {
  initial?: string;
  variant?: 'page' | 'header';
}) {
  const [term, setTerm] = useState(initial);
  const debouncedTerm = useDebouncedValue(term.trim(), 300);
  const [matches, setMatches] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    setTerm(initial);
  }, [initial]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!debouncedTerm) {
        setMatches([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setFetchError(null);
      try {
        const result = await apiGet<PagedResult<Product>>(
          `/api/products?q=${encodeURIComponent(debouncedTerm)}&pageSize=${SUGGESTION_LIMIT}`,
        );
        if (!cancelled) {
          setMatches(result.data);
          setActiveIndex(-1);
          setOpen(true);
        }
      } catch (err) {
        if (!cancelled) {
          setMatches([]);
          setFetchError(err instanceof Error ? err.message : 'Search failed');
          setOpen(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [debouncedTerm]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  function goToSearch(query: string) {
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    setActiveIndex(-1);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (activeIndex >= 0 && matches[activeIndex]) {
      setOpen(false);
      navigate(`/products/${matches[activeIndex].id}`);
      return;
    }
    goToSearch(term);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp') && matches.length) {
      setOpen(true);
    }

    if (event.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (!open || (!matches.length && !debouncedTerm)) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % Math.max(matches.length, 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? matches.length - 1 : index - 1));
    }
  }

  const showPanel = open && Boolean(debouncedTerm) && term.trim().length > 0;
  const inputId = `search-${variant}`;

  return (
    <div
      className={`search-bar-wrap search-bar-wrap--${variant}`}
      ref={wrapRef}
      role="combobox"
      aria-expanded={showPanel}
      aria-haspopup="listbox"
      aria-owns={showPanel ? listId : undefined}
    >
      <form className={`search-bar search-bar--${variant}`} onSubmit={onSubmit} role="search">
        <label className="sr-only" htmlFor={inputId}>
          Search products
        </label>
        <input
          id={inputId}
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (debouncedTerm) setOpen(true);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search Linecard"
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls={showPanel ? listId : undefined}
          aria-activedescendant={
            activeIndex >= 0 && matches[activeIndex]
              ? `${listId}-option-${matches[activeIndex].id}`
              : undefined
          }
        />
        <button className="search-submit" type="submit" aria-label="Search">
          {variant === 'header' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                fill="currentColor"
                d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              />
            </svg>
          ) : (
            'Search'
          )}
        </button>
      </form>

      {showPanel && (
        <div className="search-suggestions" id={listId} role="listbox" aria-label="Search suggestions">
          {loading && matches.length === 0 && (
            <p className="search-suggestions-status">Searching…</p>
          )}
          {!loading && fetchError && (
            <p className="search-suggestions-status search-suggestions-status--error">
              {fetchError}
            </p>
          )}
          {!loading && !fetchError && matches.length === 0 && (
            <p className="search-suggestions-status">No matches for “{debouncedTerm}”</p>
          )}
          {matches.map((product, index) => (
            <Link
              key={product.id}
              id={`${listId}-option-${product.id}`}
              role="option"
              aria-selected={index === activeIndex}
              className={`search-suggestion${index === activeIndex ? ' is-active' : ''}`}
              to={`/products/${product.id}`}
              onClick={() => setOpen(false)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <img src={product.image} alt="" width={40} height={40} />
              <span className="search-suggestion-body">
                <span className="search-suggestion-title">{product.title}</span>
                <span className="search-suggestion-meta">
                  {product.category} · ${product.price.toFixed(2)}
                </span>
              </span>
            </Link>
          ))}
          {matches.length > 0 && (
            <button
              type="button"
              className="search-suggestions-all"
              onClick={() => goToSearch(term)}
            >
              View all results for “{debouncedTerm}”
            </button>
          )}
        </div>
      )}
    </div>
  );
}
