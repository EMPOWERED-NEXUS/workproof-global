import { useEffect, useState, type ReactNode } from 'react';
import { api, setSessionExpiredHandler, type UserProfile } from '../lib/api';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const me = await api.me();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setSessionExpiredHandler(() => {
      setUser(null);
      setLoading(false);
    });
    return () => setSessionExpiredHandler(null);
  }, []);

  useEffect(() => {
    void refresh();
  }, []);

  async function logout() {
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
