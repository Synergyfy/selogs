import api from './api';

export interface OrgSubscription {
  id: string;
  status: string;
  planId?: string;
  planName?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface InitializeSubscriptionDto {
  planId: string;
  billingCycle: 'monthly' | 'yearly';
}

export const SubscriptionService = {
  getMySubscription: async (): Promise<OrgSubscription> => {
    const response = await api.get('/subscriptions/me');
    return response.data;
  },

  initializeSubscription: async (data: InitializeSubscriptionDto): Promise<{ authorizationUrl: string }> => {
    const response = await api.post('/subscriptions/initialize', data);
    return response.data;
  },

  verifySubscription: async (reference: string): Promise<OrgSubscription> => {
    const response = await api.post(`/subscriptions/verify?reference=${reference}`);
    return response.data;
  },
};
