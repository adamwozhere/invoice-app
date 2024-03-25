import { DevTool } from '@hookform/devtools';
import { useFieldArray, useForm } from 'react-hook-form';
import { useCustomers } from '../hooks/useCustomers';
import CustomerSelect from './CustomerSelect';
import { Customer } from '../types/Customer';
import { FormInput } from './ui/FormInput';
import Button from './ui/Button';
import {
  InvoiceDraft,
  InvoiceInput,
  invoiceSchema,
} from '../schemas/invoice.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateInvoice } from '../hooks/useCreateInvoice';
import { useNavigate } from 'react-router-dom';

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

// export type FormValues = {
//   date: Date;
//   paymentTerms: number;
//   customer: string;
//   items: {
//     description: string;
//     quantity: number;
//     amount: number;
//   }[];
//   newCustomer?: {
//     name: string;
//     email: string;
//     address: {
//       line1: string;
//       line2?: string;
//       city: string;
//       county?: string;
//       postcode: string;
//     };
//   };
// };

export default function InvoiceForm() {
  const navigate = useNavigate();
  const { data: customers } = useCustomers();
  const { mutate: createInvoice } = useCreateInvoice();
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState,
    getValues,
    setValue,
    reset,
  } = useForm<InvoiceInput>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      paymentTerms: 28,
      customer: '',
      items: [{}],
      status: 'draft',
    },
  });

  const { errors } = formState;
  const watchCustomer = watch('customer');

  const { fields, append, remove } = useFieldArray({
    name: 'items',
    control,
  });

  const onSubmit = (data: InvoiceInput) => {
    console.log('onSubmit', data);
    // TODO: save as draft ? - need to set status before this so that it goes through zodResolver
    // will need to be a hidden form element?
    data.status = 'pending';
    createInvoice(data, {
      onSuccess: () => {
        reset();
        navigate('/invoices');
      },
    });
  };

  const saveDraft = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const data = formState;
    console.log('saveDraft', data);
  };

  return (
    <div className="w-full">
      <form
        className="flex flex-col w-full"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit(onSubmit)(event);
        }}
      >
        <div>
          <label htmlFor="date">Invoice Date</label>
          <input
            type="date"
            id="date"
            {...register('date', { valueAsDate: true })}
            defaultValue={new Date().toISOString().substring(0, 10)}
          />
        </div>

        <input
          hidden
          disabled
          aria-disabled
          type="text"
          {...register('status')}
        />

        <FormInput
          label="Payment terms (days)"
          error={errors.paymentTerms}
          {...register('paymentTerms')}
        />

        <CustomerSelect
          customers={customers as Customer[]}
          selected={watchCustomer}
          register={register}
          getValues={getValues}
          setValue={setValue}
          reset={reset}
          errors={errors}
        />

        <div className="mt-8 w-full">
          <div className="flex gap-4 text-sm font-bold">
            <label id="labelQuantity" className="w-1/5">
              Quantity
            </label>
            <label id="labelDescription" className="w-3/5">
              Item description
            </label>
            <label id="labelAmount" className="w-1/5">
              Unit Price (£)
            </label>
          </div>
          <div>
            {fields.map((field, index) => {
              return (
                <div key={field.id} className="flex gap-4">
                  <FormInput
                    className="w-1/5"
                    {...register(`items.${index}.quantity` as const)}
                    aria-describedby="labelQuantity"
                    placeholder="1"
                    error={errors.items && errors.items[index]?.quantity}
                  />
                  <FormInput
                    className="w-3/5"
                    {...register(`items.${index}.description` as const)}
                    aria-describedby="labelDescription"
                    placeholder="Item"
                    error={errors.items && errors.items[index]?.description}
                  />
                  <FormInput
                    className="w-1/5"
                    {...register(`items.${index}.amount` as const)}
                    placeholder="100"
                    aria-describedby="labelAmount"
                    error={errors.items && errors.items[index]?.amount}
                  />
                  <div>{field.amount * field.quantity}</div>
                  <Button
                    label="x"
                    aria-label="Remove item"
                    disabled={index === 0}
                    onClick={(e) => {
                      e.preventDefault();
                      remove(index);
                    }}
                  />
                </div>
              );
            })}
            <Button
              label="Add item"
              onClick={(e) => {
                e.preventDefault();
                append({} as InvoiceInput['items']);
              }}
            />
          </div>
        </div>
        <Button onClick={saveDraft} label="Save draft" />
        <Button type="submit" label="Create invoice" />
      </form>
      <DevTool control={control} />
      <pre>{JSON.stringify(customers, null, 2)}</pre>
    </div>
  );
}

