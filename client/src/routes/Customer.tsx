import { useNavigate, useParams } from 'react-router-dom';
import CustomerDetail from '../components/CustomerDetail';
import { useCustomers } from '../hooks/useCustomers';
import type { Customer } from '../types/Customer';
import { useDeleteCustomer } from '../hooks/useDeleteCustomer';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Modal from '../components/ui/Modal';
import BackButton from '../components/ui/BackButton';
import BackIcon from '../components/icons/BackIcon';
import Button from '../components/ui/Button';

export default function Customer() {
  const { customerId } = useParams() as { customerId: string };
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const { data, error, isLoading } = useCustomers(customerId);
  const customer = data as Customer;
  const { mutate: deleteCustomer, isPending } = useDeleteCustomer();

  const handleDelete = () => {
    setModalOpen(false);
    deleteCustomer(customerId, {
      onSettled: () => {
        navigate('/customers');
      },
      onSuccess: () => {
        toast.success('Customer deleted');
        console.log('delete customer');
        navigate('/customers');
      },
    });
  };

  if (error) {
    return <p>Something went wrong...</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-5xl w-full">
      <div className="sticky top-0 bg-gray-200">
        <div className="bg-white rounded-b-xl px-6 py-2 pt-7 mb-6">
          <BackButton to="/customers" label="Back" icon={<BackIcon />} />
          <div className="flex items-center justify-end gap-2 my-4 mt-8">
            <Button label="Edit" />
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
              <p>Are you sure you want to delete this customer?</p>
            </Modal>
          </div>
        </div>
      </div>

      <article className="w-full bg-white px-8 py-10 rounded-xl mt-4">
        <CustomerDetail customer={customer} />
      </article>
    </div>
  );
}

