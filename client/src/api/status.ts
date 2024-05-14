import axios from './axios';

export async function statusCheck() {
  const res = await axios.get<string>(
    'https://mint-invoicing-api.onrender.com/api/status',
    { withCredentials: true }
  );
  return res;
}

