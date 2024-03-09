import axios from 'axios';

export function getCustomers() {
  const customers = axios
    .get<object[]>('/api/customers')
    .then((res) => res.data);

  return customers;
}

