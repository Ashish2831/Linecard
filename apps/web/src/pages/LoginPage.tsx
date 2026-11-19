import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorText } from '../components/Status';

interface Props {
  onLogin: (email: string, password: string) => Promise<unknown>;
}

export function LoginPage({ onLogin }: Props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@linecard.local');
  const [password, setPassword] = useState('LinecardDemo1!');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onLogin(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="commerce-page auth-page page-enter">
      <div className="auth-card">
        <p className="auth-kicker">Linecard account</p>
        <h1>Sign in</h1>
        <p className="muted">Demo credentials are pre-filled for reviewers.</p>
        <form onSubmit={onSubmit}>
          <div className="form-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="form-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <ErrorText message={error} />}
          <button
            className={`btn btn-accent btn-block${submitting ? ' btn-busy' : ''}`}
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="auth-foot muted">
          <Link to="/">Continue shopping</Link>
        </p>
      </div>
    </div>
  );
}
