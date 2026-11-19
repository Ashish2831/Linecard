# Product Requirements Document — Linecard

## 1. Product overview

**Product:** Linecard  
**One-line:** A web product catalogue where customers browse, search, ask questions, and submit sales enquiries.  
**Type:** B2B-style catalogue MVP / PoC  
**Platform:** Web

## 2. Problem

Entrepreneurs need an interactive catalogue proof of concept that can grow beyond a throwaway prototype — swappable product source, email, and AI providers.

## 3. Goal

Ship a foundation reviewers can run locally that meets Officeworks acceptance criteria and demonstrates growable architecture.

## 4. Target users

- **Customer:** browses products, searches, asks about products / catalogue, submits enquiry  
- **Sales:** receives enquiry email in inbox (Mailpit locally)  
- **Reviewer / engineer:** runs Compose, evaluates design and AI practice

## 5. MVP acceptance criteria

1. **Home** — 5 top-rated featured products  
2. **Category** — top-rated + additional products for a category  
3. **Search** — text match on title/description via search button  
4. **Product detail** — tile opens detail page  
5. **Enquiry** — form → sales email + thank-you message  

## 6. Extras (in scope for this build)

- Demo-user auth (session + Redis)  
- CSRF on state-changing POSTs  
- Product Ask AI + catalogue RAG (stub default)  
- Redis cache / rate limits / RAG index  

## 7. Non-goals

- Payments, cart, checkout  
- Mobile native apps  
- OAuth / real IdP  
- Production SES / Bedrock requirement  
- E2E Playwright  
- Primary SQL database for products  

## 8. Definition of done

- [ ] AC flows work via Compose  
- [ ] Critical-path tests pass  
- [ ] Docs: README, DECISIONS, AI_USAGE, agent docs  
- [ ] No secrets committed; stub AI works without paid keys  
