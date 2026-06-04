import api from './api';
import type { Invoice, PaymentMethod } from '../types/dashboard';

export const BillingService = {
  getInvoices: async (page: number = 1, limit: number = 20): Promise<{ items: Invoice[]; total: number }> => {
    const response = await api.get('/billing/invoices', {
      params: { page, limit },
    });
    return response.data;
  },

  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const response = await api.get('/billing/payment-methods');
    return response.data;
  },

  setDefaultPaymentMethod: async (id: string): Promise<void> => {
    await api.post(`/billing/payment-methods/${id}/default`);
  },
};
