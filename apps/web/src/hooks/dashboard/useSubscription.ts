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

export const useInitializeSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SubscriptionService.initializeSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'subscription'] });
    },
  });
};

export const useVerifySubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SubscriptionService.verifySubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'subscription'] });
    },
  });
};
