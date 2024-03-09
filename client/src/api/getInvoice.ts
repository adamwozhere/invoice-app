import axios from 'axios';

export function getInvoice(invoiceId: string | undefined) {
  const invoice = axios
    .get<object>(`/api/invoices/${invoiceId}`)
    .then((res) => res.data);

  return invoice;
}

