import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  role: string | null;
  setAuth: (token: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(() => localStorage.getItem('role'));

  function setAuth(newToken: string, newRole: string) {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    setToken(newToken);
    setRole(newRole);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ token, role, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
