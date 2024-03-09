import axios from 'axios';

export function getCustomer(customerId: string | undefined) {
  const customer = axios
    .get<object>(`/api/customers/${customerId}`)
    .then((res) => res.data);

  return customer;
}

