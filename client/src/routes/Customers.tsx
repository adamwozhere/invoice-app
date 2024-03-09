import { useQuery } from '@tanstack/react-query';
import { getCustomers } from '../api/getCustomers';
import { Link } from 'react-router-dom';

export default function Customers() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  });

  if (error) {
    return <p>Something went wrong...</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Link to="new">Add New Customer</Link>
      <h1>Customers</h1>
      <ul>
        {data?.map((cust) => (
          <li key={cust.id}>
            <Link to={cust.id}>{cust.name}</Link>
          </li>
        ))}
      </ul>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

