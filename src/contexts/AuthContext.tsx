import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as api from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'voter';
  walletAddress?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signup: (data: { walletAddress: string; name?: string; email?: string }) => Promise<void>;
  login: (credentials: api.LoginRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token');
  });

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (token) {
      refreshUser();
    }
  }, [token]);

  const signup = async (data: { walletAddress: string; name?: string; email?: string }) => {
    await api.signup(data);
    // Don't set token or user - user needs admin approval first
    // The signup endpoint returns a message about pending approval
  };

  const login = async (credentials: api.LoginRequest) => {
    const response = await api.login(credentials);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('auth_token', response.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const response = await api.getMe(token);
      setUser(response.user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        signup,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
