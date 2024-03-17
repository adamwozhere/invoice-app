import { DevTool } from '@hookform/devtools';
import { useFieldArray, useForm } from 'react-hook-form';
import { useCustomers } from '../hooks/useCustomers';
import CustomerSelect from './CustomerSelect';
import { Customer } from '../types/Customer';

// TODO: note on react-hook-form void returns for attributes:
/**
 * see here: https://github.com/orgs/react-hook-form/discussions/8622
 *
 * when trying to use <form onSubmit={handleSubmit(onSubmit)}> ...
 * this doesn't work as the handleSubmit function from reacthookform returns a Promise<void>
 * I thought adding void handleSubmit(onSubmit) would work however it does not e.preventDefault() and refreshes page
 * either add a eslint rule for void returns for attributes,
 * or change to onSubmit={(event) => void handleSubmit(onSubmit)(event)}
 * I'm unsure which is best to use in this situation
 *
 * can also inline the event.preventDefault() which means I dont have to have typed in the onSubmit function:
 * onSubmit={(event) => { event.preventDefault(); void handleSubmit(onSubmit)(event)}
 * You still need to pass event to onSubmit even though preventDefault() is handled before onSubmit,
 * however you then don't need the optional e?: React.BaseSyntheticEvent in the onSubmit function
 *
 * also note that another rule I added in eslint for children render prop may not be needed now, as I'm not using TanStack Form
 */

export type FormValues = {
  paymentTerms: number;
  customer: string;
  items: {
    description: string;
    quantity: number;
    amount: number;
  }[];
  newCustomer?: {
    name: string;
    email: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      county?: string;
      postcode: string;
    };
  };
};

export default function InvoiceForm() {
  const { data: customers } = useCustomers();

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState,
    getValues,
    setValue,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      paymentTerms: 28,
      customer: '',
      items: [{ description: '', quantity: 1, amount: 0 }],
    },
  });

  const { errors } = formState;
  const watchCustomer = watch('customer');

  const { fields, append, remove } = useFieldArray({
    name: 'items',
    control,
  });

  const onSubmit = (data: FormValues) => {
    console.log('onSubmit', data);
  };

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit(onSubmit)(event);
        }}
      >
        <div>
          <label htmlFor="paymentTerms">Payment terms (days)</label>
          <input
            id="paymentTerms"
            type="number"
            {...register('paymentTerms')}
          />
          <p>{errors.paymentTerms?.message}</p>
        </div>

        <CustomerSelect
          customers={customers as Customer[]}
          selected={watchCustomer}
          register={register}
          getValues={getValues}
          setValue={setValue}
          reset={reset}
        />

        <div>
          <label>Items</label>
          <div>
            {fields.map((field, index) => {
              return (
                <div key={field.id}>
                  <label htmlFor={field.id}>Description</label>
                  <input
                    type="text"
                    {...register(`items.${index}.description` as const)}
                  />
                  <label htmlFor="">Quantity</label>
                  <input
                    type="number"
                    {...register(`items.${index}.quantity` as const)}
                  />
                  <label htmlFor="">Amount</label>
                  <input
                    type="number"
                    {...register(`items.${index}.amount` as const)}
                  />
                  {index > 0 ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        remove(index);
                      }}
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              );
            })}
            <button
              onClick={(e) => {
                e.preventDefault();
                append({ description: '', quantity: 1, amount: 0 });
              }}
            >
              Add item
            </button>
          </div>
        </div>

        <button type="submit">Submit</button>
      </form>
      <DevTool control={control} />
      <pre>{JSON.stringify(customers, null, 2)}</pre>
    </div>
  );
}

