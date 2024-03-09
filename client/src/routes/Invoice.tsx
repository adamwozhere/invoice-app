import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { getInvoice } from '../api/getInvoice';

export default function Invoice() {
  const { invoiceId } = useParams();

  const { data, error, isLoading } = useQuery({
    queryKey: ['invoices', { invoiceId }],
    queryFn: () => getInvoice(invoiceId),
  });

  if (error) {
    return <p>Something went wrong...</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Link to="/invoices">Back</Link>
      <h1>Invoice</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

