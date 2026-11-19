import type { ApiError } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

let csrfToken: string | null = null;

interface Envelope<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

async function parse<T>(response: Response): Promise<T> {
  const body = (await response.json()) as Envelope<T>;
  if (!body.success || body.data === undefined) {
    const error = new Error(body.error?.message ?? 'Request failed') as Error & {
      code?: string;
      status?: number;
    };
    error.code = body.error?.code;
    error.status = response.status;
    throw error;
  }
  return body.data;
}

export async function ensureCsrf(): Promise<string> {
  if (csrfToken) return csrfToken;
  const data = await apiGet<{ csrfToken: string }>('/api/auth/csrf');
  csrfToken = data.csrfToken;
  return csrfToken;
}

export function clearCsrf() {
  csrfToken = null;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
  });
  return parse<T>(response);
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const token = await ensureCsrf();
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': token,
    },
    body: JSON.stringify(body ?? {}),
  });
  return parse<T>(response);
}
