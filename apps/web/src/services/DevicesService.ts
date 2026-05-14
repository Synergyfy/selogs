import api from './api';

export interface Device {
  id: string;
  deviceId: string;
  name?: string;
  branchId: string;
  branchName: string;
  gateId: string;
  gateName: string;
  lastActive?: string;
  createdAt: string;
}

export interface CreateDeviceDto {
  deviceId: string;
  name?: string;
  branchId: string;
  gateId: string;
}

export interface UpdateDeviceDto {
  name?: string;
  branchId?: string;
  gateId?: string;
}

export const DevicesService = {
  getDevices: async (): Promise<Device[]> => {
    const response = await api.get('/devices');
    return response.data;
  },

  createDevice: async (data: CreateDeviceDto): Promise<Device> => {
    const response = await api.post('/devices', data);
    return response.data;
  },

  updateDevice: async (id: string, data: UpdateDeviceDto): Promise<Device> => {
    const response = await api.patch(`/devices/${id}`, data);
    return response.data;
  },

  deleteDevice: async (id: string): Promise<void> => {
    await api.delete(`/devices/${id}`);
  },
};
