import SignupForm from '../components/SignupForm';

export default function Signup() {
  // TODO: redirect if already signed up
  return (
    <div className="max-w-sm w-full h-full flex flex-col justify-center">
      <SignupForm />
    </div>
  );
}

