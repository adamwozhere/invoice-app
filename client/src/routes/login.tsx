import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
      <h2>
        Or <Link to="/signup">sign up</Link>
      </h2>
    </div>
  );
}

