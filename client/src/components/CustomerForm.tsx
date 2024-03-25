import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FormInput } from './ui/FormInput';
import { CustomerInput } from '../schemas/customer.schema';
import Button from './ui/Button';

type Props = {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<CustomerInput>;
  errors: FieldErrors<CustomerInput>;
  submitLabel: string;
};

export default function CustomerForm({
  onSubmit,
  register,
  errors,
  submitLabel,
}: Props) {
  return (
    <div>
      <form onSubmit={onSubmit}>
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
        <Button label={submitLabel} type="submit" />
      </form>
    </div>
  );
}

