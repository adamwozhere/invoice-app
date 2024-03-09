import { useForm } from '@tanstack/react-form';
import { useAuth } from '../hooks/useAuth';

function LoginForm() {
  const { login } = useAuth();
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const { email, password } = value;

      await login(email, password);
    },
  });
  return (
    <div>
      <form.Provider>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <div>
            <label htmlFor="email">Email</label>
            <form.Field
              name="email"
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
            <label htmlFor="password">Password</label>
            <form.Field
              name="password"
              children={(field) => (
                <input
                  type="password"
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

export default LoginForm;

