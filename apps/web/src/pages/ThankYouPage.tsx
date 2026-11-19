import { Link } from 'react-router-dom';

export function ThankYouPage() {
  return (
    <div className="commerce-page auth-page page-enter">
      <div className="auth-card auth-card--success">
        <div className="success-mark" aria-hidden>
          ✓
        </div>
        <h1>Thank you</h1>
        <p className="muted">
          Your enquiry was sent to the sales inbox. Our team will get back to you shortly.
        </p>
        <Link className="btn btn-accent btn-block" to="/">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
