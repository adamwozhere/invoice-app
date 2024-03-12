import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createCustomer } from '../api/customers';

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      // TODO: use void or return?
      return queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}
