import { Link, useParams } from 'react-router-dom';
import useInvoices from '../hooks/useInvoices';
import InvoiceForm from '../components/InvoiceForm';

export default function EditInvoice() {
  const { invoiceId } = useParams() as { invoiceId: string };

  const { data, error, isLoading } = useInvoices(invoiceId);

  const invoice = {
    ...data,
    // TODO: solve input / output types, make date an ISODate object?
    // may need to turn off { valueAsDate: true } in the date input
    // date: data?.date.substring(0, 10),

    // customer is returned as customer object, pass to id string
    customer: data?.customer?.id ?? 'null',
    // date is returned as ISOString - trim off time
    date: data?.date.substring(0, 10),
  };
  console.log('the invoice is', invoice);

  if (error) {
    return <p>Something went wrong...</p>;
  }

  if (isLoading || !data) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Link to="/invoices">Back / cancel ?</Link>
      <h1>Edit Invoice</h1>
      <InvoiceForm type="EditInvoice" defaultValues={invoice} />
    </div>
  );
}

