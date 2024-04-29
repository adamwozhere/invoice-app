// import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
// import { getCustomer } from '../api/customers';

import CustomerDetail from '../components/CustomerDetail';
import { useCustomers } from '../hooks/useCustomers';
import type { Customer } from '../types/Customer';
import { useDeleteCustomer } from '../hooks/useDeleteCustomer';
import toast from 'react-hot-toast';

export default function Customer() {
  const { customerId } = useParams() as { customerId: string };
  const navigate = useNavigate();

  // const { data, error, isLoading } = useQuery({
  //   queryKey: ['customers', { customerId }],
  //   queryFn: () => getCustomer(customerId),
  // });

  const { data, error, isLoading } = useCustomers(customerId);
  const customer = data as Customer;
  const { mutate: deleteCustomer, isPending } = useDeleteCustomer();

  const handleDelete = () => {
    deleteCustomer(customerId, {
      onSettled: () => {
        console.log('settled');
        navigate('/customers');
      },
      onSuccess: () => {
        toast.success('Customer deleted');
        console.log('delete customer');
        navigate('/customers');
      },
    });
  };

  if (error) {
    return <p>Something went wrong...</p>;
  }

  if (isLoading || !data) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Link to="/customers">Back</Link>
      <Link to="edit">Edit</Link>
      <button onClick={handleDelete} disabled={isPending}>
        Delete
      </button>
      <h1>Customer</h1>
      <CustomerDetail customer={customer} />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

