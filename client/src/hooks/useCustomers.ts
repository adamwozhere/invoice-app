import { useQuery } from '@tanstack/react-query';
import { getCustomers } from '../api/customers';

export function useCustomers(customerId?: string) {
  const key = customerId ?? 'all';

  return useQuery({
    queryKey: ['customers', key],
    queryFn: getCustomers,
  });
}

