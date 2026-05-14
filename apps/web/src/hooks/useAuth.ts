import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, LoginDto, SignupDto, User } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Query to get current user profile
  const userQuery = useQuery<User, Error>({
    queryKey: ['me'],
    queryFn: authService.getMe,
    enabled: !!localStorage.getItem('access_token'),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_role', data.user.role);
      queryClient.setQueryData(['me'], data.user);
      navigate('/dashboard');
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: (data: SignupDto) => authService.signup(data),
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_role', data.user.role);
      queryClient.setQueryData(['me'], data.user);
      navigate('/dashboard');
    },
  });

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    queryClient.setQueryData(['me'], null);
    queryClient.invalidateQueries({ queryKey: ['me'] });
    navigate('/login');
  };

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    signup: signupMutation.mutate,
    isSigningUp: signupMutation.isPending,
    signupError: signupMutation.error,
    logout,
  };
};
