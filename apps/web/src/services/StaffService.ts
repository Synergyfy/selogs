import api from './api';
import type { StaffMember, CreateStaffDto, UpdateStaffDto } from '../types/dashboard';

export const StaffService = {
  getStaff: async (): Promise<StaffMember[]> => {
    const response = await api.get('/staff');
    return response.data;
  },

  createStaff: async (data: CreateStaffDto): Promise<StaffMember> => {
    const response = await api.post('/staff', data);
    return response.data;
  },

  updateStaff: async (id: string, data: UpdateStaffDto): Promise<StaffMember> => {
    const response = await api.patch(`/staff/${id}`, data);
    return response.data;
  },

  deleteStaff: async (id: string): Promise<void> => {
    await api.delete(`/staff/${id}`);
  },
};
