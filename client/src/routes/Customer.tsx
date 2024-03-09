import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCustomer } from '../api/getCustomer';
import axios from 'axios';

export default function Customer() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ['customers', { customerId }],
    queryFn: () => getCustomer(customerId),
  });

  const deleteCustomer = () => {
    return axios.delete(`/api/customers/${customerId}`).then((res) => res.data);
  };

  const mutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['customers'] });
      navigate('/customers');
    },
  });

  if (error) {
    return <p>Something went wrong...</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Link to="/customers">Back</Link>
      <Link to="edit">Edit</Link>
      <button onClick={() => mutation.mutate()}>Delete</button>
      <h1>Customer</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

