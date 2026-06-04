import api from './api';

export type GateType = 'ENTRY' | 'EXIT' | 'BOTH';

export interface Gate {
  id: string;
  name: string;
  type: GateType;
  branchId: string;
  branchName: string;
  createdAt: string;
}

export interface CreateGateDto {
  name: string;
  type?: GateType;
  branchId: string;
}

export interface UpdateGateDto {
  name?: string;
  type?: GateType;
  branchId?: string;
}

export const GatesService = {
  getGates: async (): Promise<Gate[]> => {
    const response = await api.get('/gates');
    return response.data;
  },

  createGate: async (data: CreateGateDto): Promise<Gate> => {
    const response = await api.post('/gates', data);
    return response.data;
  },

  updateGate: async (id: string, data: UpdateGateDto): Promise<Gate> => {
    const response = await api.patch(`/gates/${id}`, data);
    return response.data;
  },

  deleteGate: async (id: string): Promise<void> => {
    await api.delete(`/gates/${id}`);
  },
};
