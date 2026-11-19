# Coding Standards — Linecard

## General

- TypeScript strict; no `any` on domain boundaries  
- Modern ES6+: `const`/`let`, async/await, optional chaining, nullish coalescing, modules  
- Prefer small focused functions and reuse over new abstractions  

## SOLID & patterns in use

- Repository, Service layer, Factory, Adapter, Strategy (AI/embeddings), Decorator (Redis cache), Observer (enquiry event)  
- Dependency inversion: services take interfaces  

## Backend

- Routes: parse/validate/respond only  
- Zod at HTTP boundary  
- `AppError` hierarchy; sanitize messages to clients  
- Structured logs via `lib/logger` — never log passwords, tokens, or full session IDs  

## Frontend

- Function components + hooks  
- Local state only (no Zustand)  
- API client: `credentials: 'include'`; attach `X-CSRF-Token` on POSTs  
- Loading / empty / error states on data views  

## Testing

- Vitest; mock ports in unit tests — do not hit Fake Store HTTP in unit tests  
- Prefer testing services for business rules  

## Do / Don't

- Do: keep changes focused; update docs when ports change  
- Don't: call Fake Store or OpenAI from the browser; put Redis calls in routes  
