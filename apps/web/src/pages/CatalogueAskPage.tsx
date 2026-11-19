import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiPost } from '../api/client';
import { ErrorText } from '../components/Status';
import type { User } from '../types';

interface RagResult {
  answer: string;
  provider: string;
  citations: Array<{ productId: string; title: string }>;
}

export function CatalogueAskPage({ user }: { user: User | null }) {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<RagResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="commerce-page page-enter">
        <header className="shelf-head shelf-head--page">
          <h1>Ask the catalogue</h1>
          <p className="muted">
            <Link to="/login">Sign in</Link> to search the full line with grounded AI answers.
          </p>
        </header>
        <div className="panel ask-panel panel-gate">
          <p>Sign in with the demo account to ask catalogue-wide questions with citations.</p>
          <Link className="btn btn-accent" to="/login">
            Sign in to continue
          </Link>
        </div>
      </div>
    );
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const data = await apiPost<RagResult>('/api/catalogue/ask', { question });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ask failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="commerce-page page-enter">
      <header className="shelf-head shelf-head--page">
        <h1>Ask the catalogue</h1>
        <p className="muted">
          Retrieves relevant products across the full Linecard catalogue, then answers with
          citations.
        </p>
      </header>

      <div className="panel ask-panel">
        <form onSubmit={onSubmit}>
          <div className="form-field">
            <label htmlFor="catalogue-ask">Your question</label>
            <textarea
              id="catalogue-ask"
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Which storage drives are best for gaming?"
              required
            />
          </div>
          <button
            className={`btn btn-accent${submitting ? ' btn-busy' : ''}`}
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Searching…' : 'Ask catalogue'}
          </button>
        </form>
        {error && <ErrorText message={error} />}
        {result && (
          <div className="answer-box answer-box--enter">
            <p className="answer-meta muted">Provider: {result.provider}</p>
            <div className="answer-body">{result.answer}</div>
            {result.citations.length > 0 && (
              <div className="answer-citations">
                <strong>Related products</strong>
                <ul className="citations">
                  {result.citations.map((c) => (
                    <li key={c.productId}>
                      <Link to={`/products/${c.productId}`}>{c.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
