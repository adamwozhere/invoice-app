import { useQuery } from '@tanstack/react-query';
import { getInvoices } from '../api/invoices';

export default function useInvoices(invoiceId?: string) {
  const key = invoiceId ?? 'all';
  return useQuery({
    queryKey: ['invoices', key],
    queryFn: getInvoices,
  });
}

