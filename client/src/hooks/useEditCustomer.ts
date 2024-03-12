import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editCustomer } from '../api/customers';
import type { Customer } from '../types/Customer';

export function useEditCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      data,
    }: {
      customerId: string;
      data: Customer;
    }) => editCustomer(customerId, data),
    onSuccess: (customerId) => {
      // TODO: use void or return?
      return queryClient.invalidateQueries({
        // TODO: do I need to provide customerId ?
        queryKey: ['customers', customerId],
      });
    },
  });
}

