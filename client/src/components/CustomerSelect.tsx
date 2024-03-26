import type {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
} from 'react-hook-form';
import { Customer } from '../types/Customer';

import { useCreateCustomer } from '../hooks/useCreateCustomer';
import { FormInput } from './ui/FormInput';
import Button from './ui/Button';
import { InvoiceInput } from '../schemas/invoice.schema';

type Props = {
  customers: Customer[];
  selected: string;
  register: UseFormRegister<InvoiceInput>;
  getValues: UseFormGetValues<InvoiceInput>;
  setValue: UseFormSetValue<InvoiceInput>;
  reset: UseFormReset<InvoiceInput>;
  errors: FieldErrors<InvoiceInput>;
};

// TODO: make this into a forward ref component

export default function CustomerSelect({
  customers,
  selected,
  register,
  getValues,
  setValue,
  reset,
  errors,
}: Props) {
  const { mutate } = useCreateCustomer();

  const createCustomer = () => {
    const data = getValues('newCustomer');
    if (data) {
      mutate(
        {
          name: data.name,
          email: data.email,
          address: {
            line1: data.address.line1,
            line2: data.address.line2 ?? '',
            city: data.address.city,
            county: data.address.county ?? '',
            postcode: data.address.postcode,
          },
        },
        {
          onSuccess: (newCustomer) => {
            setValue('customer', newCustomer.id);
            // may have to use setValue instead
            reset((values) => ({
              ...values,
              newCustomer: {
                name: '',
                email: '',
                address: {
                  line1: '',
                  line2: '',
                  city: '',
                  county: '',
                  postcode: '',
                },
              },
            }));
          },
        }
      );
    }
  };

  return (
    <div>
      <label htmlFor="customer" className="text-sm font-bold block">
        Customer
      </label>
      <select
        id="customer"
        className="appearance-none flex h-9 w-full bg-slate-300 px-3 py-1 pr-8 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
        {...register('customer')}
      >
        <option value="">-select customer-</option>
        {customers?.map((cust) => (
          <option key={cust.id} value={cust.id}>
            {cust.name}
          </option>
        ))}
        <option value="new">-new customer-</option>
      </select>
      <span role="alert" className="text-red-600 text-xs font-bold">
        {errors && errors.customer?.message}
      </span>
      {selected === 'new' ? (
        <div className="mt-4">
          <FormInput
            label="Name"
            {...register('newCustomer.name')}
            error={errors.newCustomer?.name}
          />
          <FormInput
            label="Email"
            type="email"
            {...register('newCustomer.email')}
            error={errors.newCustomer?.email}
          />
          <FormInput
            label="Address line 1"
            {...register('newCustomer.address.line1')}
            error={errors.newCustomer?.address?.line1}
          />
          <FormInput
            label="Address line 2 (optional)"
            {...register('newCustomer.address.line2')}
            error={errors.newCustomer?.address?.line2}
          />
          <FormInput
            label="City"
            {...register('newCustomer.address.city')}
            error={errors.newCustomer?.address?.city}
          />
          <FormInput
            label="County (optional)"
            {...register('newCustomer.address.county')}
            error={errors.newCustomer?.address?.county}
          />
          <FormInput
            label="Postcode"
            {...register('newCustomer.address.postcode')}
            error={errors.newCustomer?.address?.postcode}
          />
          <Button onClick={createCustomer} label="Add customer" />
        </div>
      ) : null}
    </div>
  );
}

