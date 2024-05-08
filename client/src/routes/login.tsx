import LoginForm from '../components/LoginForm';

export default function Login() {
  // TODO: redirect if already logged in
  // TODO: message showing successful acount creation and prompt to now login
  return (
    <div className="max-w-sm w-full h-full flex flex-col justify-center">
      <LoginForm />
    </div>
  );
}

