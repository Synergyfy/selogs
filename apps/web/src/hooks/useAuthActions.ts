import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { LoginDto, SignupDto } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useAuthActions = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const loginMutation = useMutation({
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token);
      checkAuth();
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data: SignupDto) => authService.signup(data),
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token);
      checkAuth();
    },
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    signup: signupMutation.mutate,
    isSigningUp: signupMutation.isPending,
    signupError: signupMutation.error,
  };
};
