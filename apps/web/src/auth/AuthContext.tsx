import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { apiFetch, getToken, setToken as saveToken, clearToken } from '../lib/api';

export type Profile = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'AGENT';
  tenantId: string;
};

type AuthContextValue = {
  token: string | null;
  user: Profile | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(getToken());
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile() {
    try {
      const profile = await apiFetch<Profile>('/auth/me');
      setUser(profile);
    } catch {
      clearToken();
      setTokenState(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(newToken: string) {
    saveToken(newToken);
    setTokenState(newToken);
    await fetchProfile();
  }

  function logout() {
    clearToken();
    setTokenState(null);
    setUser(null);
  }

  return <AuthContext.Provider value={{ token, user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return ctx;
}
