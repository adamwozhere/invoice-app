import type {
  UseFormGetValues,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
} from 'react-hook-form';
import { Customer } from '../types/Customer';
import { FormValues } from './InvoiceForm';
import { useCreateCustomer } from '../hooks/useCreateCustomer';

type Props = {
  customers: Customer[];
  selected: string;
  register: UseFormRegister<FormValues>;
  getValues: UseFormGetValues<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  reset: UseFormReset<FormValues>;
};

export default function CustomerSelect({
  customers,
  selected,
  register,
  getValues,
  setValue,
  reset,
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
      <label htmlFor="customer">Customer</label>
      <select id="customer" {...register('customer')}>
        <option value="">-select customer-</option>
        {customers?.map((cust) => (
          <option key={cust.id} value={cust.id}>
            {cust.name}
          </option>
        ))}
        <option value="new">-new customer-</option>
      </select>
      {selected === 'new' ? (
        <div>
          <div>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" {...register('newCustomer.name')} />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" {...register('newCustomer.email')} />
          </div>
          <div>
            <label>Address</label>
            <div>
              <label htmlFor="line1">Line 1</label>
              <input
                id="line1"
                type="text"
                {...register('newCustomer.address.line1')}
              />
            </div>
            <div>
              <label htmlFor="line2">Line 2</label>
              <input
                id="line2"
                type="text"
                {...register('newCustomer.address.line2')}
              />
            </div>
            <div>
              <label htmlFor="city">Town / City</label>
              <input
                id="city"
                type="text"
                {...register('newCustomer.address.city')}
              />
            </div>
            <div>
              <label htmlFor="county">County</label>
              <input
                id="county"
                type="text"
                {...register('newCustomer.address.county')}
              />
            </div>
            <div>
              <label htmlFor="postcodey">Postcode</label>
              <input
                id="postcode"
                type="text"
                {...register('newCustomer.address.postcode')}
              />
            </div>
          </div>
          <button onClick={createCustomer}>Create customer</button>
        </div>
      ) : null}
    </div>
  );
}

