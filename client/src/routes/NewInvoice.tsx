import { Link } from 'react-router-dom';
import InvoiceForm from '../components/InvoiceForm';
import { InvoiceItem } from '../schemas/invoice.schema';

export default function NewInvoice() {
  return (
    <div className="min-w-[40rem]">
      <Link to="/invoices">Back / cancel ?</Link>
      <h1>New Invoice</h1>
      <InvoiceForm
        type="NewInvoice"
        defaultValues={{
          paymentTerms: 28,
          items: [{} as InvoiceItem],
          status: 'pending',
        }}
      />
    </div>
  );
}

