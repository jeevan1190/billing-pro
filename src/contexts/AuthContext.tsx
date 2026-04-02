import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: string; name: string } | null;
  login: (userId: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USER = { id: 'admin', password: '123456', name: 'Administrator' };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; name: string } | null>(() => {
    const stored = sessionStorage.getItem('billing_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((userId: string, password: string) => {
    if (userId === DEMO_USER.id && password === DEMO_USER.password) {
      const u = { id: DEMO_USER.id, name: DEMO_USER.name };
      setUser(u);
      sessionStorage.setItem('billing_user', JSON.stringify(u));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('billing_user');
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
