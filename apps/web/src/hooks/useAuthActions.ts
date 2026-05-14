import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { LoginDto, SignupDto } from '../services/auth.service';
import { useAuth } from './useAuth';

export const useAuthActions = () => {
  const { checkAuth } = useAuth();

  const loginMutation = useMutation({
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: () => {
      localStorage.setItem('is_logged_in', 'true');
      checkAuth();
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data: SignupDto) => authService.signup(data),
    onSuccess: () => {
      localStorage.setItem('is_logged_in', 'true');
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
