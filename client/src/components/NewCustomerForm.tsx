import { useForm } from '@tanstack/react-form';

import { useNavigate } from 'react-router-dom';
import { useCreateCustomer } from '../hooks/useCreateCustomer';

export default function NewCustomForm() {
  const navigate = useNavigate();

  const { mutate: createCustomer } = useCreateCustomer();

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

      createCustomer(
        { ...value },
        {
          onSuccess: (data) => {
            console.log('created customer', data);
            form.reset();
            navigate('/customers');
          },
        }
      );
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

