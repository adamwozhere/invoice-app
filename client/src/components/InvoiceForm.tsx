import { DevTool } from '@hookform/devtools';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useCustomers } from '../hooks/useCustomers';
import CustomerSelect from './CustomerSelect';
import { FormInput } from './ui/FormInput';
import Button from './ui/Button';
import {
  InvoiceInput,
  invoiceSchema,
  draftInvoiceSchema,
} from '../schemas/invoice.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateInvoice } from '../hooks/useCreateInvoice';
import { useNavigate } from 'react-router-dom';
import { useEditInvoice } from '../hooks/useEditInvoice';
import { InvoiceFormValues } from '../types/Invoice';
import toast from 'react-hot-toast';

// TODO: implement backend saving as draft (optional fields)

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

type Props = {
  type: 'NewInvoice' | 'EditInvoice';
  // defaultValues: Partial<InvoiceInput>;
  defaultValues: InvoiceFormValues;
};

export default function InvoiceForm({ type, defaultValues }: Props) {
  const navigate = useNavigate();
  const { data: customers } = useCustomers();
  const { mutate: createInvoice } = useCreateInvoice();
  const { mutate: editInvoice } = useEditInvoice();

  const methods = useForm<InvoiceFormValues>({
    // TODO: this seems to be working - but problems with treating empty string as zero:
    // look into zod coersion vs form { valueAsNumber }
    resolver: (values, context, options) => {
      const schema =
        values.status === 'draft' ? draftInvoiceSchema : invoiceSchema;
      return zodResolver(schema)(values, context, options);
    },
    defaultValues,
  });

  const { errors } = methods.formState;

  // watch customer to toggle newCustomer form inputs
  const selectedCustomer = methods.watch('customer');
  // watch status to switch draft / save as buttons depending on status

  // base isDraftInvoice on the default values to conditionally render Create Invoice button,
  // otherwise when clicking, the button will disappear as the status has been set to pending!
  const isDraftInvoice = defaultValues.status === 'draft';

  // setup items array
  const { fields, append, remove } = useFieldArray({
    name: 'items',
    control: methods.control,
  });

  // watch items to calculate and show item totals - should show grand total too?
  const watchItems = methods.watch('items');

  const onCancel = () => {
    navigate(-1);
  };

  const onSubmit = (data: InvoiceFormValues) => {
    console.log('onSubmit', data);
    // TODO: save as draft ? - need to set status before this so that it goes through zodResolver
    // will need to be a hidden form element?
    // TODO: how to deal with saving as paid / mark as paid etc - maybe button in edit form page
    // setValue('status', 'pending');
    if (type === 'NewInvoice') {
      // set to pending (note that this is changed AFTER the data is sent to this function!)
      methods.setValue('status', 'pending');
      // So need to set it directly to data (especially in case of Edit Invoice -> create invoice from a draft)
      data.status = 'pending';

      console.log('data is', data);

      createInvoice(data, {
        onSuccess: () => {
          methods.reset();
          toast.success('Invoice created!');
          navigate('/invoices');
        },
        onError: (error) => {
          toast.error('Could not create invoice - try again');
          console.log(error);
        },
      });
    } else if (type === 'EditInvoice') {
      console.log('edit invoice');
      if (isDraftInvoice) {
        console.log('setting to pending');

        // triggers changing the validation schema but not the actual data as it is already present in function
        methods.setValue('status', 'pending');
        // therefore change it inside function directly also
        data.status = 'pending';
      }
      console.log('data is', data);
      editInvoice(
        { invoiceId: data.id!, data: data },
        {
          onSuccess: () => {
            methods.reset();
            toast.success('Invoice created!');
            navigate('/invoices');
          },
          onError: (error) => {
            toast.error('Could not create invoice - try again');
            console.log(error);
          },
        }
      );
    }
  };

  const onSaveChanges = (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log('save changes');

    // trigger handleSubmit to pass the form data to edit function
    void methods.handleSubmit((data: InvoiceFormValues) => {
      console.log('try save changes');
      editInvoice(
        { invoiceId: data.id!, data },
        {
          onSuccess: () => {
            methods.reset();
            toast.success('Changes saved');
            navigate('/invoices'); // should it navigate to actual invoice?
          },
          onError: (error) => {
            toast.error('Could not save changes - try again');
            console.log(error);
          },
        }
      );
    })(event);
  };

  const onSaveDraft = (event: React.SyntheticEvent) => {
    event.preventDefault();
    // set invoiceStatus as draft
    methods.setValue('status', 'draft');
    console.log('saving draft');

    console.log('new');

    // then trigger handleSubmit to pass the form data to create function
    void methods.handleSubmit((data: InvoiceFormValues) => {
      console.log('try save new:', data);
      createInvoice(data, {
        onSuccess: () => {
          methods.reset();
          toast.success('Draft invoice created');
          navigate('/invoices');
        },
        onError: (error) => {
          toast.error('Could not create draft - try again');
          console.log(error);
        },
      });
    })(event);
  };

  return (
    <div className="w-full">
      <FormProvider {...methods}>
        <form
          className="flex flex-col w-full"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            // methods.setValue('status', 'pending');
            void methods.handleSubmit(onSubmit)(event);
          }}
        >
          <FormInput {...methods.register('id')} hidden disabled />

          <FormInput
            label="Invoice date"
            type="date"
            {...methods.register('date', { valueAsDate: true })}
            defaultValue={
              defaultValues.date ?? new Date().toISOString().substring(0, 10)
            }
            error={errors.date}
          />

          {/* TODO: add all hidden fields for whole invoice, so a full edited invoice can be sent */}

          <input
            hidden
            disabled
            aria-disabled
            type="text"
            {...methods.register('status')}
          />

          <FormInput
            label="Payment terms (days)"
            type="number"
            error={errors.paymentTerms}
            {...methods.register('paymentTerms')}
          />

          <CustomerSelect customers={customers} selected={selectedCustomer} />

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
                      {...methods.register(`items.${index}.quantity` as const)}
                      aria-describedby="labelQuantity"
                      placeholder="1"
                      error={errors.items && errors.items[index]?.quantity}
                    />
                    <FormInput
                      className="w-3/5"
                      {...methods.register(
                        `items.${index}.description` as const
                      )}
                      aria-describedby="labelDescription"
                      placeholder="Item"
                      error={errors.items && errors.items[index]?.description}
                    />
                    <FormInput
                      className="w-1/5"
                      type="number"
                      step="0.01"
                      {...methods.register(`items.${index}.amount` as const)}
                      placeholder="100"
                      aria-describedby="labelAmount"
                      error={errors.items && errors.items[index]?.amount}
                    />
                    {/* <div>{field.amount * field.quantity}</div> */}
                    <div>
                      {watchItems![index].amount! *
                        watchItems![index].quantity!}
                    </div>
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
              <div>Total: calculate total here!</div>
              <Button
                label="Add item"
                onClick={(e) => {
                  e.preventDefault();
                  append({} as InvoiceInput['items']); // TODO: change to get rid of InvoiceInput type, as using InvoiceFormValues instead
                }}
              />
            </div>
          </div>

          {type === 'NewInvoice' ? (
            <>
              <Button onClick={onCancel} label="Cancel" />
              <Button onClick={onSaveDraft} label="Save as draft" />
              <Button type="submit" label="Create invoice" />
            </>
          ) : null}

          {type === 'EditInvoice' && isDraftInvoice ? (
            <>
              <Button onClick={onCancel} label="Cancel" />
              <Button onClick={onSaveChanges} label="Save changes" />
              <Button type="submit" label="Create invoice" />
            </>
          ) : null}

          {type === 'EditInvoice' && !isDraftInvoice ? (
            <>
              <Button onClick={onCancel} label="Cancel" />
              <Button type="submit" label="Save changes" />
            </>
          ) : null}
        </form>
      </FormProvider>
      <DevTool control={methods.control} />
    </div>
  );
}

