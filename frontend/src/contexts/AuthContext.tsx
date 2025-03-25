import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, refreshToken as refreshTokenApi } from '../api/auth';
import { LoginRequest, TokenResponse, User } from '../types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('access_token');
  });
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const refreshAccessToken = async () => {
      const refresh_token = localStorage.getItem('refresh_token');
      if (!refresh_token) {
        return;
      }

      try {
        const response = await refreshTokenApi(refresh_token);
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to refresh token:', error);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    };

    if (!isAuthenticated) {
      refreshAccessToken();
    }

    // 토큰 만료 30분 전에 자동 갱신
    const interval = setInterval(refreshAccessToken, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    setIsAdmin(user?.isAdmin || false);
  }, [user]);

  const login = async (data: LoginRequest) => {
    try {
      const response = await loginApi(data);
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      if (response.user) {
        setUser(response.user);
      }
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 