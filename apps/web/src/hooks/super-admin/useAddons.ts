import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addonsService } from '../../services/addons.service';
import type { CreateAddonDto, UpdateAddonDto } from '../../services/addons.service';

export const useAddons = (includeInactive = false) => {
  const queryClient = useQueryClient();

  const addonsQuery = useQuery({
    queryKey: ['addons', { includeInactive }],
    queryFn: () => includeInactive ? addonsService.getAllAddons() : addonsService.getActiveAddons(),
  });

  const createAddonMutation = useMutation({
    mutationFn: (data: CreateAddonDto) => addonsService.createAddon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addons'] });
    },
  });

  const updateAddonMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAddonDto }) => 
      addonsService.updateAddon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addons'] });
    },
  });

  const deleteAddonMutation = useMutation({
    mutationFn: (id: string) => addonsService.deleteAddon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addons'] });
    },
  });

  const purchaseAddonMutation = useMutation({
    mutationFn: ({ addonId, quantity }: { addonId: string; quantity: number }) => 
      addonsService.purchaseAddonStandalone(addonId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'subscription'] });
    },
  });

  return {
    addons: addonsQuery.data || [],
    isLoading: addonsQuery.isLoading,
    isError: addonsQuery.isError,
    error: addonsQuery.error,
    createAddon: createAddonMutation.mutate,
    isCreating: createAddonMutation.isPending,
    updateAddon: updateAddonMutation.mutate,
    isUpdating: updateAddonMutation.isPending,
    deleteAddon: deleteAddonMutation.mutate,
    isDeleting: deleteAddonMutation.isPending,
    purchaseAddon: purchaseAddonMutation.mutate,
    isPurchasing: purchaseAddonMutation.isPending,
  };
};
