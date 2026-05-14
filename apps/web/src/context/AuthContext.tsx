import React, { useEffect, useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { User } from '../services/auth.service';
import { AuthContext } from './AuthContextObject';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('is_logged_in'));

  const { data: user, isLoading, isError, refetch } = useQuery<User, Error>({
    queryKey: ['me'],
    queryFn: authService.getMe,
    enabled: isLoggedIn,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const logout = useCallback(() => {
    localStorage.removeItem('is_logged_in');
    localStorage.removeItem('user_role');
    setIsLoggedIn(false);
    queryClient.setQueryData(['me'], null);
    queryClient.clear();
  }, [queryClient]);

  const checkAuth = useCallback(() => {
    setIsLoggedIn(!!localStorage.getItem('is_logged_in'));
    refetch();
  }, [refetch]);

  // If logged in but query failed (e.g. 401), logout
  useEffect(() => {
    if (isError && isLoggedIn) {
      logout();
    }
  }, [isError, isLoggedIn, logout]);

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
