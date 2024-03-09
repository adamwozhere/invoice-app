import { useQuery } from '@tanstack/react-query';
import { getCustomer } from '../api/getCustomer';
import { useParams } from 'react-router-dom';
import EditCustomerForm from '../components/EditCustomerForm';

export default function EditCustomer() {
  const { customerId } = useParams();

  const { data, error, isLoading } = useQuery({
    queryKey: ['customers', { customerId }],
    queryFn: () => getCustomer(customerId),
  });

  if (error) {
    return <p>Something went wrong...</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Edit Customer</h1>
      <EditCustomerForm />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

