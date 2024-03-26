import { DevTool } from '@hookform/devtools';
import { useFieldArray, useForm } from 'react-hook-form';
import { useCustomers } from '../hooks/useCustomers';
import CustomerSelect from './CustomerSelect';
import { Customer } from '../types/Customer';
import { FormInput } from './ui/FormInput';
import Button from './ui/Button';
import {
  InvoiceInput,
  // draftSchema,
  invoiceSchema,
  draftInvoiceSchema,
  InvoiceDraft,
} from '../schemas/invoice.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateInvoice } from '../hooks/useCreateInvoice';
import { useNavigate } from 'react-router-dom';
import { ZodError } from 'zod';

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

export default function InvoiceForm() {
  const navigate = useNavigate();
  const { data: customers } = useCustomers();
  const { mutate: createInvoice } = useCreateInvoice();

  // TODO: look at how the zodResolver is constructed
  const dynamicResolver = (values: InvoiceInput | InvoiceDraft) => {
    const schema =
      values.status === 'draft' ? draftInvoiceSchema : invoiceSchema;

    console.log('parsing values:', values);

    try {
      const parsed = schema.parse(values);
      console.log('parsed');
      return {
        values: parsed,
        errors: {},
      };
    } catch (error) {
      console.log('failed', error);
      if (error instanceof ZodError) {
        // const zodErrors = error.flatten();
        const errors: Record<string, any> = {};

        error.errors.forEach((err) => {
          errors[err.path.join('.')] = {
            type: 'validation',
            message: err.message,
          };
        });

        return {
          values: {},
          errors,
        };
        // return {
        //   values: {},
        //   errors: error.errors.reduce((prev: any, curr: any) => {
        //     return {
        //       ...prev,
        //       [curr.path[0]]: {
        //         type: curr.message,
        //         message: curr.message,
        //       },
        //     };
        //   }, {}),
        // };
      } else {
        // toast error
        console.error('Unhandled error:', error);
        throw error;
        // return {
        //   values: {},
        //   errors: {},
        // };
      }
    }
  };

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState,
    getValues,
    setValue,
    setError,
    reset,
  } = useForm<InvoiceInput>({
    // resolver: zodResolver(invoiceSchema),
    // resolver: dynamicResolver,
    // TODO: this seems to be working - but problems with treating empty string as zero:
    // look into zod coersion vs form { valueAsNumber }
    resolver: (values, context, options) => {
      const schema =
        values.status === 'draft' ? draftInvoiceSchema : invoiceSchema;
      return zodResolver(schema)(values, context, options);
    },
    defaultValues: {
      paymentTerms: 28,
      customer: '',
      items: [{}],
      status: 'pending',
    },
    // mode: 'onChange',
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
    // TODO: how to deal with saving as paid / mark as paid etc - maybe button in edit form page
    // setValue('status', 'pending');
    createInvoice(data, {
      onSuccess: () => {
        reset();
        navigate('/invoices');
      },
    });
  };

  // TODO: this seems to work but it doesn't get rid of the errors if you edit a field -
  // could maybe just set the validation type to onChange in the useForm?
  const saveDraft = (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log('saveDraft');
    setValue('status', 'draft');

    void handleSubmit(onSubmit)(event);

    // try {
    //   const data = getValues();
    //   const parsed = draftInvoiceSchema.parse(data);
    //   console.log('parsed data:', parsed);

    //   createInvoice(parsed, {
    //     onSuccess: () => {
    //       reset();
    //       navigate('/invoices');
    //     },
    //   });
    // } catch (error) {
    //   if (error instanceof ZodError) {
    //     error.errors.forEach((validationError) => {
    //       setError(validationError.path[0] as keyof InvoiceDraft, {
    //         type: 'manual',
    //         message: validationError.message,
    //       });
    //     });
    //   }
    // }
  };

  return (
    <div className="w-full">
      <form
        className="flex flex-col w-full"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setValue('status', 'pending');
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
          type="number"
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
                    type="number"
                    {...register(`items.${index}.quantity` as const, {
                      valueAsNumber: true,
                    })}
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
                    type="number"
                    step="0.01"
                    {...register(`items.${index}.amount` as const, {
                      valueAsNumber: true,
                    })}
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

