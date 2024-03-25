import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { FormInput } from './ui/FormInput';
import Button from './ui/Button';
import { LoginInput, loginSchema } from '../schemas/login.schema';
import { zodResolver } from '@hookform/resolvers/zod';

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

    await login(data.email, data.password);
  };

  return (
    <div className="min-w-md bg-slate-50 p-8">
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
    </div>
  );
}

