import axios from 'axios';

export function getInvoices() {
  console.log('getInvoices');
  const invoices = axios.get<object[]>('/api/invoices').then((res) => res.data);

  return invoices;
}

