import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { useState } from 'react';

export const Route = createFileRoute('/login')({
  component: Login,
});

function Login() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [message, setMessage] = useState<string | null>('hello');

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const { email, password } = value;
      // do something with form data
      try {
        const res = await axios.post(
          '/auth/login',
          { email, password },
          { withCredentials: true }
        );

        const accessToken = res?.data?.accessToken as string;
        setMessage(res?.statusText);
        auth.setAuth({
          email: res?.data?.email,
          accessToken,
          isAuthenticated: true,
        });
        await navigate({ to: '/' });
      } catch (e) {
        console.log(e);
      }

      // auth.setUser(value.email);
    },
  });

  return (
    <div>
      <p>{message}</p>
      <form.Provider>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <div>
            <form.Field
              name="email"
              children={(field) => (
                <input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
            <form.Field
              name="password"
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
          <button>Submit</button>
        </form>
      </form.Provider>
    </div>
  );
}

