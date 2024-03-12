import { useForm } from '@tanstack/react-form';
// import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
// import { getCustomer } from '../api/customers';
import { useEditCustomer } from '../hooks/useEditCustomer';
import type { Customer } from '../types/Customer';
import { useCustomers } from '../hooks/useCustomers';

export default function EditCustomerForm() {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const mutation = useEditCustomer();

  const custId = customerId ?? '';

  const { data: cust, error, isLoading } = useCustomers(customerId);

  // TODO: fix problem where customer can be an array ?
  const data = cust as Customer;

  const form = useForm({
    defaultValues: {
      name: data?.name ?? '',
      email: data?.email ?? '',
      address: {
        line1: data?.address.line1 ?? '',
        line2: data?.address.line2 ?? '',
        city: data?.address.city ?? '',
        county: data?.address.county ?? '',
        postcode: data?.address.postcode ?? '',
      },
      // TODO: do I handle the id here?
      id: data?.id ?? '',
    },
    onSubmit: ({ value }: { value: Customer }) => {
      mutation.mutate(
        { customerId: custId, data: value },
        { onSuccess: () => navigate('/customers') }
      );
    },
  });

  if (error) {
    return <p>Something went wrong...</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <form.Provider>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <div>
            <label htmlFor="name">Name</label>
            <form.Field
              name="name"
              children={(field) => (
                <input
                  id="name"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <form.Field
              name="email"
              children={(field) => (
                <input
                  id="email"
                  type="email"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
          </div>
          <div>
            <label htmlFor="address.line1">Address line 1</label>
            <form.Field
              name="address.line1"
              children={(field) => (
                <input
                  id="address.line1"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
          </div>
          <div>
            <label htmlFor="address.line2">Address line 2</label>
            <form.Field
              name="address.line2"
              children={(field) => (
                <input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
          </div>
          <div>
            <label htmlFor="address.city">Town / City</label>
            <form.Field
              name="address.city"
              children={(field) => (
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
          </div>
          <div>
            <label htmlFor="address.county">County</label>
            <form.Field
              name="address.county"
              children={(field) => (
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
          </div>
          <div>
            <label htmlFor="address.postcode">Postcode</label>
            <form.Field
              name="address.postcode"
              children={(field) => (
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
          </div>
          <button>Submit</button>
        </form>
      </form.Provider>
    </div>
  );
}

