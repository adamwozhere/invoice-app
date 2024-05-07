import { useForm } from 'react-hook-form';
import { FormInput } from './ui/FormInput';
import { CustomerInput, customerSchema } from '../schemas/customer.schema';
import Button from './ui/Button';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCustomer } from '../hooks/useCreateCustomer';
import toast from 'react-hot-toast';

export default function CustomerForm() {
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
        toast.success('Customer created');
      },
      onError: (err) => {
        console.error(err);
        toast.error('Could not create customer, try again');
      },
    });
  };
  const navigate = useNavigate();

  const onCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    navigate('/customers');
  };
  return (
    <div className="w-full">
      <div className="bg-white px-6 py-8 rounded-xl">
        <form
          className="flex flex-col w-full"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit(onSubmit)(event);
          }}
        >
          <FormInput {...register('name')} label="Name" error={errors.name} />
          <FormInput
            {...register('email')}
            label="Email"
            type="email"
            error={errors.email}
          />
          <FormInput
            {...register('address.line1')}
            label="Address line 1"
            error={errors.address?.line1}
          />
          <FormInput
            {...register('address.line2')}
            label="Address line 2 (optional)"
            error={errors.address?.line2}
          />
          <FormInput
            {...register('address.city')}
            label="City / Town"
            error={errors.address?.city}
          />
          <FormInput
            {...register('address.county')}
            label="County (optional)"
            error={errors.address?.county}
          />
          <FormInput
            {...register('address.postcode')}
            label="Postcode"
            error={errors.address?.postcode}
          />
          <div className="flex justify-between gap-4 mt-10">
            <Button label="Cancel" onClick={onCancel} variant="tertiary" />
            <Button label="Add customer" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}

