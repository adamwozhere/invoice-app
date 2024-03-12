import { Link, useParams } from 'react-router-dom';
import useInvoices from '../hooks/useInvoices';

export default function Invoice() {
  const { invoiceId } = useParams();

  // const { data, error, isLoading } = useQuery({
  //   queryKey: ['invoices', { invoiceId }],
  //   queryFn: () => getInvoice(invoiceId),
  // });
  const { data, error, isLoading } = useInvoices(invoiceId);

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

