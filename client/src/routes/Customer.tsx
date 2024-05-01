// import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
// import { getCustomer } from '../api/customers';

import CustomerDetail from '../components/CustomerDetail';
import { useCustomers } from '../hooks/useCustomers';
import type { Customer } from '../types/Customer';
import { useDeleteCustomer } from '../hooks/useDeleteCustomer';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import Modal from '../components/ui/Modal';

export default function Customer() {
  const { customerId } = useParams() as { customerId: string };
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // const { data, error, isLoading } = useQuery({
  //   queryKey: ['customers', { customerId }],
  //   queryFn: () => getCustomer(customerId),
  // });

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

  useEffect(() => {
    console.log('modal is open? ', modalOpen);
  }, [modalOpen]);

  if (error) {
    return <p>Something went wrong...</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Link to="/customers">Back</Link>
      <Link to="edit">Edit</Link>
      <button onClick={() => setModalOpen(true)} disabled={isPending}>
        Delete
      </button>
      <Modal
        title="Confirm delete"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
      >
        <p>Are you sure you want to delete this customer?</p>
      </Modal>

      <h1>Customer</h1>
      <CustomerDetail customer={customer} />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

