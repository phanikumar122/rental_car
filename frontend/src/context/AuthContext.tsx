import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api';
import type { User } from '../types';

interface AuthContextType {
  user:            User | null;
  token:           string | null;
  login:           (token: string, user: User) => void;
  logout:          () => void;
  isAuthenticated: boolean;
  isLoading:       boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user,      setUser]      = useState<User | null>(null);
  const [token,     setToken]     = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  // [FIX M-07] Use a ref so the effect runs only once on mount, preventing
  // the logout → token=null → re-run → logout infinite loop.
  const initialized = useRef(false);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get<User>('/api/auth/me');
        setUser(response.data);
      } catch {
        // Token is invalid or expired — clear it silently
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [logout]);


  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
