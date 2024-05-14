import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { FormInput } from './ui/FormInput';
import Button from './ui/Button';
import { LoginInput, loginSchema } from '../schemas/login.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { Link } from 'react-router-dom';

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });
  const { login } = useAuth();

  const onSubmit = async (data: LoginInput) => {
    console.log('login', data);

    try {
      await login(data.email, data.password);
    } catch (err) {
      console.error(err);
      if (err instanceof AxiosError && err?.response?.status === 401) {
        toast.error('Incorrect username or password');
      } else {
        toast.error('Error: try again');
      }
    }
  };

  return (
    <div className="bg-gray-200 p-8 -mt-32">
      <h1 className="text-4xl font-bold text-gray-500 mb-10">Log in</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit(onSubmit)(event);
        }}
      >
        <FormInput {...register('email')} label="Email" error={errors.email} />
        <FormInput
          {...register('password')}
          label="Password"
          type="password"
          error={errors.password}
        />
        <Button label="Log in" type="submit" />
      </form>
      <h2 className="mt-8 text-lg text-gray-500">
        Don&apos;t have an account?&nbsp;
        <Link
          to="/signup"
          className="text-black font-medium hover:underline underline-offset-2"
        >
          Sign up
        </Link>
        .
      </h2>
    </div>
  );
}

