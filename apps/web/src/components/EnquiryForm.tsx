import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiPost } from '../api/client';
import { ErrorText } from './Status';

interface Props {
  productId: string;
  isAuthenticated: boolean;
  compact?: boolean;
}

export function EnquiryForm({ productId, isAuthenticated, compact = false }: Props) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className={compact ? 'buy-box-gate' : 'panel'}>
        {!compact && <h3>Enquire</h3>}
        <p className="muted">
          <Link to="/login">Sign in</Link> to send a sales enquiry.
        </p>
        <Link className="btn btn-accent btn-block" to="/login">
          Sign in to enquire
        </Link>
      </div>
    );
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiPost('/api/enquiries', {
        productId,
        name,
        email,
        phone: phone || undefined,
        message,
      });
      navigate('/enquiry/thank-you');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enquiry failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={compact ? 'buy-box-form' : 'panel'}>
      {!compact && <h3>Enquire</h3>}
      <form onSubmit={onSubmit}>
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="phone">Phone (optional)</label>
          <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            rows={compact ? 3 : 4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        {error && <ErrorText message={error} />}
        <button
          className={`btn btn-accent btn-block${submitting ? ' btn-busy' : ''}`}
          type="submit"
          disabled={submitting}
        >
          {submitting ? 'Sending…' : 'Enquire now'}
        </button>
      </form>
    </div>
  );
}
