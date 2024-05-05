import { Link, useNavigate, useParams } from 'react-router-dom';
import useInvoices from '../hooks/useInvoices';
import Button from '../components/ui/Button';
import { useDeleteInvoice } from '../hooks/useDeleteInvoice';
import toast from 'react-hot-toast';
import { useEditInvoice } from '../hooks/useEditInvoice';
import { useState } from 'react';
import Modal from '../components/ui/Modal';
import BackButton from '../components/ui/BackButton';
import BackIcon from '../components/icons/BackIcon';

export default function Invoice() {
  const { invoiceId } = useParams() as { invoiceId: string };
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // const { data, error, isLoading } = useQuery({
  //   queryKey: ['invoices', { invoiceId }],
  //   queryFn: () => getInvoice(invoiceId),
  // });
  const { data, error, isLoading } = useInvoices(invoiceId);

  const { mutate: deleteInvoice, isPending } = useDeleteInvoice();
  const { mutate: updateInvoice } = useEditInvoice();

  const dateFormat = new Intl.DateTimeFormat('en-UK');

  const handleDelete = () => {
    deleteInvoice(invoiceId, {
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
    <div className="max-w-3xl w-full">
      <BackButton to="/invoices" label="Back" icon={<BackIcon />} />
      <Link to="edit">Edit</Link>
      <h1>Invoice</h1>
      {data?.status !== 'draft' ? (
        <Button
          label={
            data?.status === 'pending' ? 'Mark as paid' : 'Mark as pending'
          }
          onClick={handleMarkAsPaid}
          disabled={data?.status === 'paid'}
        />
      ) : null}

      <Button
        label="Delete"
        onClick={() => setModalOpen(true)}
        disabled={isPending}
      />
      <Modal
        title="Confirm delete"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
      >
        <p>Are you sure you want to delete this invoice?</p>
      </Modal>

      <div className="flex items-center gap-2 w-full bg-white px-8 py-6 rounded-t-xl">
        <span className="sr-only">status</span>
        <span className="inline-flex gap-2 text-xs uppercase py-2 px-4 rounded-full font-bold bg-orange-100 text-orange-400 border-2 border-orange-400">
          {data?.status}
        </span>
        <button className="ml-auto text-sm font-bold bg-zinc-300 px-4 py-2 rounded-lg min-w-16">
          Edit
        </button>
        <button className="text-sm font-bold bg-zinc-300 px-4 py-2 rounded-lg min-w-16">
          Delete
        </button>
        <button className="text-sm font-bold bg-zinc-300 px-4 py-2 rounded-lg min-w-16">
          Mark as paid
        </button>
      </div>

      <article className="w-full bg-white px-8 py-10 rounded-b-xl mt-4">
        <h1 className="font-extrabold text-zinc-500 text-2xl">Invoice</h1>
        <h2 className="font-extrabold text-black">
          # {data?.invoiceNumber.toString().padStart(5, '0')}
        </h2>
        <div className="flex gap-8 mt-12">
          <div>
            <h3>
              <div className="font-bold">Date:</div>
              <div className="text-zinc-500">
                {dateFormat.format(Date.parse(data?.date ?? ''))}
              </div>
            </h3>
            <h3 className="mt-4">
              <div className="font-bold">Due:</div>
              <div className="text-zinc-500">
                {dateFormat.format(Date.parse(data?.due ?? ''))}
              </div>
            </h3>
          </div>
          <div>
            <h3 className="font-bold">Billed to:</h3>
            <address className="not-italic mt-2 text-slate-500">
              {data?.customer?.name}
              <br />
              {data?.customer?.email}
              <br />
              {data?.customer?.address.line1}
              <br />
              {data?.customer?.address.line2}
              <br />
              {data?.customer?.address.city}
              <br />
              {data?.customer?.address.county}
              <br />
              {data?.customer?.address.postcode}
              <br />
            </address>
          </div>
        </div>

        <table className="table-fixed w-full bg-slate-200 rounded-t-2xl p-8 mt-12">
          <caption className="sr-only">Item details</caption>
          <thead className="uppercase text-xs font-extrabold text-slate-500">
            <tr>
              <th scope="col" className="px-2 py-4 text-start">
                Item
              </th>
              <th scope="col" className="px-2 py-4 text-start">
                Quantity
              </th>
              <th scope="col" className="px-2 py-4 text-start">
                Amount
              </th>
              <th scope="col" className="px-2 py-4 text-start">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="p-8">
            {data?.items.map((item) => (
              <tr key={item.id}>
                <td className="px-2 py-2 text-start">{item.description}</td>
                <td className="px-2 py-2 text-start">{item.quantity}</td>
                <td className="px-2 py-2 text-start">{item.amount}</td>
                <td className="px-2 py-2 text-start">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-green-900 px-6 py-8 rounded-b-xl text-end text-white">
          <span className="font-bold mr-4">Total due:</span>
          &nbsp;
          <span className="text-4xl font-extrabold">£{data?.total}</span>
        </div>
      </article>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
}

