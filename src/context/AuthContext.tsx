'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Workspace } from '@/src/types';
import { authApi, LoginPayload, RegisterPayload } from '@/src/services/authApi';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  currentWorkspace: Workspace | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentWorkspace, setCurrentWorkspaceState] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('flowforge_token');
      const storedUser = localStorage.getItem('flowforge_user');
      const storedWorkspace = localStorage.getItem('flowforge_current_workspace');

      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
        if (storedWorkspace) {
          try {
            setCurrentWorkspaceState(JSON.parse(storedWorkspace));
          } catch {
            // ignore JSON parse error
          }
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setCurrentWorkspace = useCallback((workspace: Workspace | null) => {
    setCurrentWorkspaceState(workspace);
    if (workspace) {
      localStorage.setItem('flowforge_current_workspace', JSON.stringify(workspace));
    } else {
      localStorage.removeItem('flowforge_current_workspace');
    }
  }, []);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(payload);
      const { user: loggedInUser, accessToken, refreshToken } = response.data;

      localStorage.setItem('flowforge_token', accessToken);
      localStorage.setItem('flowforge_refresh_token', refreshToken);
      localStorage.setItem('flowforge_user', JSON.stringify(loggedInUser));

      setUser(loggedInUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(payload);
      const { user: registeredUser, workspace, accessToken, refreshToken } = response.data;

      localStorage.setItem('flowforge_token', accessToken);
      localStorage.setItem('flowforge_refresh_token', refreshToken);
      localStorage.setItem('flowforge_user', JSON.stringify(registeredUser));
      
      setUser(registeredUser);

      if (workspace) {
        setCurrentWorkspace(workspace);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('flowforge_refresh_token');
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {
      // proceed with local cleanup even if API fails
    } finally {
      localStorage.removeItem('flowforge_token');
      localStorage.removeItem('flowforge_refresh_token');
      localStorage.removeItem('flowforge_user');
      localStorage.removeItem('flowforge_current_workspace');
      setUser(null);
      setCurrentWorkspaceState(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentWorkspace,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        setCurrentWorkspace,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
