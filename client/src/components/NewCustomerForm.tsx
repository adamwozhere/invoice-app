import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function NewCustomForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const createCustomer = (value: object) => {
    return axios.post('/api/customers', { ...value }).then((res) => res.data);
  };

  const mutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: (data) => {
      queryClient.setQueryData(['customers', data.id], data);
      void queryClient.invalidateQueries({ queryKey: ['customers'] });
      navigate('/customers');
    },
  });

  const form = useForm({
    defaultValues: {
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
    onSubmit: ({ value }) => {
      // handle new customer
      console.log('submitted new customer with data', JSON.stringify(value));

      // const customer = await axios.post('/api/customers', {
      //   ...value,
      // });
      const customer = mutation.mutate(
        { ...value },
        { onSuccess: () => form.reset() }
      );
      console.log('created customer', customer);
    },
  });

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

