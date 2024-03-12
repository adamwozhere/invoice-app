import { Link } from 'react-router-dom';
import useInvoices from '../hooks/useInvoices';

export default function Invoices() {
  const { data, error, isLoading } = useInvoices();

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

