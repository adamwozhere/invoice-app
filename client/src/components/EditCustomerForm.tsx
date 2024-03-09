import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomer } from '../api/getCustomer';
import axios from 'axios';

export default function EditCustomerForm() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const editCustomer = (value: object) => {
    return axios
      .put(`/api/customers/${customerId}`, { ...value })
      .then((res) => res.data);
  };

  const mutation = useMutation({
    mutationFn: editCustomer,
    onSuccess: (data) => {
      queryClient.setQueryData(['customers', data.id], data);
      void queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  const { data, error, isLoading } = useQuery({
    queryKey: ['customers', { customerId }],
    queryFn: () => getCustomer(customerId),
  });

  const form = useForm({
    defaultValues: {
      ...data,
    },
    onSubmit: ({ value }) => {
      const customer = mutation.mutate(
        { ...value },
        { onSuccess: () => navigate('/customers') }
      );
      console.log('edited customer', customer);
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

