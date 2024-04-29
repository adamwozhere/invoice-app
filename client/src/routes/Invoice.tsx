import { Link, useNavigate, useParams } from 'react-router-dom';
import useInvoices from '../hooks/useInvoices';
import Button from '../components/ui/Button';
import { useDeleteInvoice } from '../hooks/useDeleteInvoice';
import toast from 'react-hot-toast';
import { useEditInvoice } from '../hooks/useEditInvoice';

export default function Invoice() {
  const { invoiceId } = useParams() as { invoiceId: string };
  const navigate = useNavigate();

  // const { data, error, isLoading } = useQuery({
  //   queryKey: ['invoices', { invoiceId }],
  //   queryFn: () => getInvoice(invoiceId),
  // });
  const { data, error, isLoading } = useInvoices(invoiceId);

  const { mutate: deleteInvoice, isPending } = useDeleteInvoice();
  const { mutate: updateInvoice } = useEditInvoice();

  const handleDelete = () => {
    deleteInvoice(invoiceId, {
      // do I need this
      onSettled: () => {
        console.log('settled');
        navigate('/invoices');
      },
      onSuccess: () => {
        toast.success('Invoice deleted');
        console.log('delete invoice');
        navigate('/invoices');
      },
      onError: (err) => {
        console.log('error deleting invoice:', err);
        toast.error('Error deleting invoice, try again');
      },
    });
  };

  const handleMarkAsPaid = () => {
    updateInvoice(
      {
        invoiceId,
        data: { ...data, customer: data?.customer.id, status: 'paid' },
      },
      {
        onSuccess: () => {
          toast.success('Invoice updated');
          console.log('marked as paid');
        },
        onError: (err) => {
          console.log('error marking invoice as paid', err);
          toast.error('Error updating invoice, try again');
        },
      }
    );
  };

  if (error) {
    return <p>Something went wrong...</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Link to="/invoices">Back</Link>
      <Link to="edit">Edit</Link>
      <h1>Invoice</h1>
      <Button
        label={data?.status === 'pending' ? 'Mark as paid' : 'Mark as pending'}
        onClick={handleMarkAsPaid}
        disabled={data?.status === 'paid'}
      />
      <Button label="Delete" onClick={handleDelete} disabled={isPending} />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

