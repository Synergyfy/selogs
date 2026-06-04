import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BillingService } from '../../services/BillingService';
import type { Invoice, PaymentMethod } from '../../types/dashboard';

export const useInvoicesList = (page: number = 1, limit: number = 20) => {
  return useQuery<{ items: Invoice[]; total: number }, Error>({
    queryKey: ['dashboard', 'invoices', page, limit],
    queryFn: () => BillingService.getInvoices(page, limit),
  });
};

export const usePaymentMethods = () => {
  return useQuery<PaymentMethod[], Error>({
    queryKey: ['dashboard', 'payment-methods'],
    queryFn: BillingService.getPaymentMethods,
  });
};

export const useSetDefaultPaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BillingService.setDefaultPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'payment-methods'] });
    },
  });
};
