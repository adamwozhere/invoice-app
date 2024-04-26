import { useFormContext } from 'react-hook-form';
import { Customer } from '../types/Customer';

import { useCreateCustomer } from '../hooks/useCreateCustomer';
import { FormInput } from './ui/FormInput';
import Button from './ui/Button';
import { InvoiceFormValues } from '../types/Invoice';
import toast from 'react-hot-toast';

type Props = {
  customers: Customer[] | undefined;
  selected: string | undefined;
};

// TODO: look into the HTML datalist for the customer select
// TODO: make this into a forward ref component? -- register goes in wrong order because new customer is rendered conditionally

export default function CustomerSelect({ customers, selected }: Props) {
  const methods = useFormContext<InvoiceFormValues>();
  const { mutate } = useCreateCustomer();

  const createCustomer = () => {
    // event.preventDefault();
    // event.stopPropagation();
    // TODO: how to not trigger validation for fields outside the new customer form? as it seems to submit, show an error field and unset the invoice date
    const data = methods.getValues('newCustomer');
    if (data) {
      mutate(
        {
          name: data.name ?? '',
          email: data.email ?? '',
          address: {
            line1: data.address?.line1 ?? '',
            line2: data.address?.line2 ?? '',
            city: data.address?.city ?? '',
            county: data.address?.county ?? '',
            postcode: data.address?.postcode ?? '',
          },
        },
        {
          onSuccess: (newCustomer) => {
            toast.success('Customer created');
            methods.setValue('customer', newCustomer.id);
            // may have to use setValue instead
            methods.reset((values) => ({
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
          onError: (error) => {
            toast.error('Could not create customer, try again');
            console.log(error);
          },
        }
      );
    }
  };

  return (
    <div>
      <select
        id="customer"
        className="appearance-none flex h-9 w-full bg-slate-300 px-3 py-1 pr-8 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
        {...methods.register('customer')}
      >
        <option value="null">-select customer-</option>
        {customers?.map((cust) => (
          <option key={cust.id} value={cust.id}>
            {cust.name}
          </option>
        ))}
        <option value="new">-new customer-</option>
      </select>
      <span role="alert" className="text-red-600 text-xs font-bold">
        {methods.formState.errors && methods.formState.errors.customer?.message}
      </span>
      {selected === 'new' ? (
        <div className="mt-4">
          <FormInput
            label="Name"
            {...methods.register('newCustomer.name')}
            error={methods.formState.errors.newCustomer?.name}
          />
          <FormInput
            label="Email"
            type="email"
            {...methods.register('newCustomer.email')}
            error={methods.formState.errors.newCustomer?.email}
          />
          <FormInput
            label="Address line 1"
            {...methods.register('newCustomer.address.line1')}
            error={methods.formState.errors.newCustomer?.address?.line1}
          />
          <FormInput
            label="Address line 2 (optional)"
            {...methods.register('newCustomer.address.line2')}
            error={methods.formState.errors.newCustomer?.address?.line2}
          />
          <FormInput
            label="City"
            {...methods.register('newCustomer.address.city')}
            error={methods.formState.errors.newCustomer?.address?.city}
          />
          <FormInput
            label="County (optional)"
            {...methods.register('newCustomer.address.county')}
            error={methods.formState.errors.newCustomer?.address?.county}
          />
          <FormInput
            label="Postcode"
            {...methods.register('newCustomer.address.postcode')}
            error={methods.formState.errors.newCustomer?.address?.postcode}
          />
          <Button onClick={createCustomer} label="Add customer" />
        </div>
      ) : null}
    </div>
  );
}

