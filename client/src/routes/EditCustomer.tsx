// import { useQuery } from '@tanstack/react-query';
// import { getCustomer } from '../api/customers';
import { useNavigate, useParams } from 'react-router-dom';

import { useCustomers } from '../hooks/useCustomers';
import { useEditCustomer } from '../hooks/useEditCustomer';
import { useForm } from 'react-hook-form';
import { CustomerInput, customerSchema } from '../schemas/customer.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomerForm from '../components/CustomerForm';

export default function EditCustomer() {
  // TODO: find best way of aserting that customerId is not null
  // can use as { customerId: string}
  // { customerId = '' } = useParams
  // params = useParams(); const customerId = params.customerId ?? '';
  const { customerId } = useParams() as { customerId: string };

  const { data, error, isLoading } = useCustomers(customerId);

  const navigate = useNavigate();
  const { mutate: editCustomer } = useEditCustomer();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: data,
  });

  // TODO: find best way of asserting that data will have an id
  const onSubmit = (data: CustomerInput) => {
    editCustomer(
      { customerId, data: { ...data, id: data.id! } },
      {
        onSuccess: () => {
          reset();
          navigate(`/customers/${customerId}`);
        },
      }
    );
  };

  if (error) {
    return <p>Something went wrong...</p>;
  }

  if (isLoading || !data) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Edit Customer</h1>
      <CustomerForm
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit(onSubmit)(event);
        }}
        register={register}
        errors={errors}
        submitLabel="Save"
      />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

