import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiPost } from '../api/client';
import { ErrorText } from './Status';

interface Props {
  productId: string;
  isAuthenticated: boolean;
}

export function ProductAskPanel({ productId, isAuthenticated }: Props) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="panel panel-soft">
        <h3>Ask about this product</h3>
        <p className="muted">
          <Link to="/login">Sign in</Link> to ask Linecard AI about this item.
        </p>
      </div>
    );
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const result = await apiPost<{ answer: string; provider: string }>(
        `/api/products/${productId}/ask`,
        { question },
      );
      setAnswer(result.answer);
      setProvider(result.provider);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ask failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="panel panel-soft">
      <h3>Ask about this product</h3>
      <form onSubmit={onSubmit}>
        <div className="form-field">
          <label htmlFor="product-ask">Question</label>
          <textarea
            id="product-ask"
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about specs, use cases, or fit…"
            required
          />
        </div>
        <button
          className={`btn${submitting ? ' btn-busy' : ''}`}
          type="submit"
          disabled={submitting}
        >
          {submitting ? 'Asking…' : 'Ask'}
        </button>
      </form>
      {error && <ErrorText message={error} />}
      {answer && (
        <div className="answer-box answer-box--enter">
          {provider && <p className="answer-meta muted">Provider: {provider}</p>}
          <div className="answer-body">{answer}</div>
        </div>
      )}
    </div>
  );
}
