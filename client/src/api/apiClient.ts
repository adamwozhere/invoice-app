import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

let accessToken: string | null = null;

const api = axios.create({
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const { auth } = useAuth();

    if (accessToken !== auth?.accessToken) {
      accessToken = auth?.accessToken ?? null;
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
    console.log('axios api auth header:', config.headers.Authorization);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

