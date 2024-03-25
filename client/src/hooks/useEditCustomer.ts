import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editCustomer } from '../api/customers';
import type { Customer } from '../types/Customer';

export function useEditCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      // TODO: do I need to provide customerId ?
      customerId,
      data,
    }: {
      customerId: string;
      data: Customer;
    }) => editCustomer(customerId, data),
    onSuccess: (customer) => {
      // TODO: use void or return?
      return queryClient.invalidateQueries({
        queryKey: ['customers', customer.id],
      });
    },
  });
}

