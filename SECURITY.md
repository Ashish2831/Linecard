# Security — Linecard

## Authentication

- Cookie session (`express-session`) stored in Redis  
- Demo user from env (`DEMO_USER_EMAIL` / `DEMO_USER_PASSWORD`), password hashed with bcrypt at boot  
- Browse public; login required for enquiry, product ask, catalogue ask  

## CSRF

- Synchronizer token in session  
- `GET /api/auth/csrf` returns token  
- POSTs require `X-CSRF-Token` header  

## API protection

- Zod validation + string sanitize/length limits  
- Redis token-bucket rate limits: login, enquiry, ask, RAG (`limit` = burst capacity; refills over `windowMs`)  
- Helmet; CORS with credentials to web origin  
- httpOnly, SameSite=lax session cookie  

## Secrets

- Never commit `.env`; use `.env.example`  
- Never expose OpenAI keys to the client  
- Never log passwords, API keys, or raw session IDs  

## XSS

- React text binding only; no `dangerouslySetInnerHTML` for product/user content  

## Checklist

- [ ] Auth + authorization server-side  
- [ ] CSRF on mutating routes  
- [ ] Input validation  
- [ ] Rate limiting  
- [ ] Error messages sanitized  
- [ ] Secrets out of git  
