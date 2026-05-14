import api from './api';

export interface Branch {
  id: string;
  name: string;
  address?: string | null;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBranchDto {
  name: string;
  address?: string;
  code?: string;
}

export interface UpdateBranchDto {
  name?: string;
  address?: string;
}

export const BranchesService = {
  getBranches: async (): Promise<Branch[]> => {
    const response = await api.get('/branches');
    return response.data;
  },

  createBranch: async (data: CreateBranchDto): Promise<Branch> => {
    const response = await api.post('/branches', data);
    return response.data;
  },

  updateBranch: async (id: string, data: UpdateBranchDto): Promise<Branch> => {
    const response = await api.patch(`/branches/${id}`, data);
    return response.data;
  },

  deleteBranch: async (id: string): Promise<void> => {
    await api.delete(`/branches/${id}`);
  },
};
