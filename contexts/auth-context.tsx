"use client"

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { authFetch } from '@/lib/auth-fetch';

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  profileImageUrl: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserResponse | null;
  login: (atk: string, rtk: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  }, []);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await authFetch('https://code.haru2end.dedyn.io/api/user/info', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const userData = await response.json();
        // Fix for Mixed Content error from Kakao CDN
        if (userData.profileImageUrl && userData.profileImageUrl.startsWith('http://k.kakaocdn.net')) {
          userData.profileImageUrl = userData.profileImageUrl.replace('http://', 'https://');
        }
        setUser(userData);
        setIsLoggedIn(true);
      } else {
        if (response.status === 401 || response.status === 403) {
          logout();
        }
      }
    } catch (error) {
      console.error("Failed to fetch user info", error);
    }
  }, [logout]);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          const response = await authFetch('https://code.haru2end.dedyn.io/api/user/is-logged-in', {
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (response.ok && await response.json()) {
            setIsLoggedIn(true);
            await fetchUser();
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        } catch (error) {
          console.error("Token verification failed", error);
          // Keep local session state on transient network errors.
          setIsLoggedIn(true);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setIsLoading(false);
    };
    verifyToken();
  }, [fetchUser]);

  const login = useCallback(async (atk: string, rtk: string) => {
    localStorage.setItem('accessToken', atk);
    localStorage.setItem('refreshToken', rtk);
    setIsLoggedIn(true);
    await fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, refreshUser: fetchUser, isLoading }}>
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
