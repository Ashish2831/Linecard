import { useCallback, useEffect, useState } from 'react';
import { apiGet, apiPost, clearCsrf, ensureCsrf } from '../api/client';
import type { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      await ensureCsrf();
      const me = await apiGet<User>('/api/auth/me');
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function login(email: string, password: string) {
    const me = await apiPost<User>('/api/auth/login', { email, password });
    setUser(me);
    return me;
  }

  async function logout() {
    await apiPost<{ ok: true }>('/api/auth/logout');
    clearCsrf();
    setUser(null);
    await ensureCsrf();
  }

  return { user, loading, login, logout, refresh };
}
