import { useForm } from 'react-hook-form';
import { createUser } from '../api/users';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FormInput } from './ui/FormInput';
import { SignupInput, signupSchema } from '../schemas/signup.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from './ui/Button';

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: SignupInput) => {
    console.log('signup', data);
    try {
      await createUser(data);
      navigate('/login');
      toast.success('Sign up successful!');
    } catch (err) {
      if (
        err instanceof Error &&
        err.message &&
        err.message.indexOf('E11000')
      ) {
        setError('email', {
          type: 'api_error',
          message: 'Email address already taken',
        });
      }
      toast.error('Error ocurred, try again');
    }
  };

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit(onSubmit)(event);
        }}
      >
        <FormInput
          {...register('email')}
          label="Email"
          type="email"
          error={errors.email}
        />
        <FormInput
          {...register('password')}
          label="Password"
          type="Password"
          error={errors.password}
        />
        <FormInput
          {...register('passwordConfirmation')}
          label="Confirm password"
          type="password"
          error={errors.passwordConfirmation}
        />
        <Button label="Sign up" type="submit" />
      </form>
    </div>
  );
}

