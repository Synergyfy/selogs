import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, Role } from '../services/auth.service';
import type { User } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: Role | null;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));

  const { data: user, isLoading, isError, refetch } = useQuery<User, Error>({
    queryKey: ['me'],
    queryFn: authService.getMe,
    enabled: !!token,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    setToken(null);
    queryClient.setQueryData(['me'], null);
    queryClient.clear();
  };

  const checkAuth = () => {
    setToken(localStorage.getItem('access_token'));
    refetch();
  };

  // If token exists but query failed (e.g. 401), logout
  useEffect(() => {
    if (isError && token) {
      logout();
    }
  }, [isError, token]);

  return (
    <AuthContext.Provider value={{ 
      user: user || null, 
      isLoading, 
      isAuthenticated: !!user, 
      role: user?.role || null,
      logout,
      checkAuth
    }}>
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
