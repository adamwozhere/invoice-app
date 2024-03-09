import { useQuery } from '@tanstack/react-query';
import { getInvoices } from '../api/getInvoices';
import { Link } from 'react-router-dom';

export default function Invoices() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices,
  });

  if (error) {
    return <p>Something went wrong...</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Invoices</h1>
      <ul>
        {data?.map((inv) => (
          <li key={inv.id}>
            <Link to={inv.id}>
              {inv.invoiceNumber} - {inv.total} - {inv.status}
            </Link>
          </li>
        ))}
      </ul>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

