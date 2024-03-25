import { Link } from 'react-router-dom';
import InvoiceForm from '../components/InvoiceForm';

export default function NewInvoice() {
  return (
    <div className="min-w-[40rem]">
      <Link to="/invoices">Back / cancel ?</Link>
      <h1>New Invoice</h1>
      <InvoiceForm />
    </div>
  );
}

