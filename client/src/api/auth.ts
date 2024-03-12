import axios from 'axios';

export async function loginUser(email: string, password: string) {
  const res = await axios.post<{ email: string; accessToken: string }>(
    '/auth/login',
    { email, password }
  );
  return res.data;
}

export async function refreshAccessToken() {
  const res = await axios.get<{ accessToken: string }>('/auth/refresh');
  return res.data.accessToken;
}

