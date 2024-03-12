import { useNavigate } from 'react-router-dom';
import { useDeleteCustomer } from '../hooks/useDeleteCustomer';
import type { Customer } from '../types/Customer';

export default function CustomerDetail({ customer }: { customer: Customer }) {
  const navigate = useNavigate();
  const { mutate: deleteCustomer, isPending } = useDeleteCustomer();

  const handleDelete = () => {
    deleteCustomer(customer.id, {
      onSuccess: () => {
        navigate('/customers');
      },
    });
  };

  if (!customer) {
    return <p>pending...</p>;
  }

  return (
    <div>
      <button onClick={handleDelete} disabled={isPending}>
        Delete
      </button>
      <p>{customer.name}</p>
      <p>{customer.email}</p>
      <address>
        {customer.address.line1}
        <br />
        {customer.address.line2}
        <br />
        {customer.address.city}
        <br />
        {customer.address.county}
        <br />
        {customer.address.postcode}
        <br />
      </address>
      <pre>{JSON.stringify(customer, null, 2)}</pre>
    </div>
  );
}

