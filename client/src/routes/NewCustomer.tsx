import { useNavigate } from 'react-router-dom';
import { useCreateCustomer } from '../hooks/useCreateCustomer';
import { useForm } from 'react-hook-form';
import { CustomerInput, customerSchema } from '../schemas/customer.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomerForm from '../components/CustomerForm';

export default function NewCustomer() {
  const navigate = useNavigate();
  const { mutate: createCustomer } = useCreateCustomer();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
  });

  const onSubmit = (data: CustomerInput) => {
    createCustomer(data, {
      onSuccess: () => {
        reset();
        navigate('/customers');
      },
    });
  };

  return (
    <div className="max-w-5xl w-full">
      <div>
        <h1>New customer</h1>
      </div>
      <CustomerForm
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit(onSubmit)(event);
        }}
        register={register}
        errors={errors}
        submitLabel="Add customer"
      />
    </div>
  );
}

