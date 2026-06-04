import api from './api';

export interface OrgSubscription {
  id: string;
  status: string;
  planId?: string;
  planName?: string;
  currentPeriodEnd?: string;
  nextBillingDate?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface CheckoutDto {
  planId: string;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  addonIds?: string[];
}

export const SubscriptionService = {
  getMySubscription: async (): Promise<OrgSubscription> => {
    const response = await api.get('/subscriptions/me');
    return response.data;
  },

  initializeCheckout: async (data: CheckoutDto): Promise<{ accessCode: string; reference: string }> => {
    const response = await api.post('/subscriptions/checkout', data);
    return response.data;
  },

  startTrial: async (planId: string): Promise<OrgSubscription> => {
    const response = await api.post(`/subscriptions/start-trial/${planId}`);
    return response.data;
  },

  cancelSubscription: async (): Promise<{ message: string }> => {
    const response = await api.post('/subscriptions/cancel');
    return response.data;
  },
};
