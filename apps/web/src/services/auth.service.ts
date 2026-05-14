import api from './api';

export type Role = 'admin' | 'supervisor' | 'guard' | 'super_admin';

export interface User {
  id: string;
  email: string;
  role: Role;
  fullName?: string;
  organizationId?: string;
  branchId?: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface SignupResponse {
  access_token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  email: string;
  password: string;
  role: Role;
  fullName?: string;
  organizationName?: string;
  organizationType?: string;
  mainLocation?: string;
  superAdminSecret?: string;
}

export const authService = {
  async login(data: LoginDto): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  async signup(data: SignupDto): Promise<SignupResponse> {
    const response = await api.post<SignupResponse>('/auth/signup', data);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  }
};
