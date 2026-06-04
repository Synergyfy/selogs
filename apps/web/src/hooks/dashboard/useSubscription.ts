import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SubscriptionService } from '../../services/SubscriptionService';
import type { OrgSubscription } from '../../services/SubscriptionService';

export const useMySubscription = () => {
  return useQuery<OrgSubscription, Error>({
    queryKey: ['dashboard', 'subscription'],
    queryFn: SubscriptionService.getMySubscription,
    retry: false, // Don't retry 404s for orgs without a subscription yet
  });
};

export const useInitializeCheckout = () => {
  return useMutation({
    mutationFn: SubscriptionService.initializeCheckout,
  });
};

export const useStartTrial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SubscriptionService.startTrial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'subscription'] });
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SubscriptionService.cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'subscription'] });
    },
  });
};
