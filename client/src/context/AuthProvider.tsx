import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ReactNode, createContext, useEffect, useState } from 'react';

export interface AuthContextType {
  auth: {
    email: string;
    accessToken: string;
    isAuthenticated: boolean;
  } | null;
  setAuth: ({
    email,
    accessToken,
    isAuthenticated,
  }: {
    email: string;
    accessToken: string;
    isAuthenticated: boolean;
  }) => void;
}
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // const [user, setUser] = useState<string | null>(null);
  // AuthContext.isAuthenticated = !!user;
  const [auth, setAuth] = useState<AuthContextType['auth'] | null>(null);

  // augment axios requests to add bearer token
  useEffect(() => {
    const controller = new AbortController();

    const requestInterceptor = axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig & { sent?: boolean }) => {
        if (config.sent) {
          console.log('aborting request');
          controller.abort();
        }

        if (auth && auth.accessToken) {
          config.headers.Authorization = `Bearer ${auth.accessToken}`;
        }
        return { ...config, signal: controller.signal };
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      // status codes in 2xx range
      (res) => res,
      // status codes outside 2xx range trigger error function
      async (error: AxiosError) => {
        if (!error.config) {
          return Promise.reject(error);
        }
        const prevReq: InternalAxiosRequestConfig & { sent?: boolean } =
          error.config;

        console.log('interceptor response prevReq:', JSON.stringify(prevReq));
        console.log('interceptor status', JSON.stringify(error));

        if (prevReq && error.response?.status === 403 && !prevReq.sent) {
          console.log('refreshing token');
          prevReq.sent = true;
          const { data } = await axios.get<{ accessToken: string }>(
            '/auth/refresh',
            { withCredentials: true }
          );

          console.log('/auth/refresh -> accessToken', data.accessToken);
          setAuth((prev) => ({
            email: prev!.email,
            isAuthenticated: prev!.isAuthenticated,
            accessToken: data.accessToken,
          }));

          prevReq.headers.Authorization = `Bearer ${data.accessToken}`;
          return Promise.resolve(axios(prevReq));
        }
        return Promise.reject(error);
      }
    );

    // cleanup
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

// NOTE: could use Dispatch<SetStateAction<Auth>>;

// import { useState, createContext, Dispatch, SetStateAction } from 'react';

// interface Auth {
//   // The properties you expect on the `auth` variable
// }

// interface AuthContextInterface {
//   auth: Auth;
//   setAuth: Dispatch<SetStateAction<Auth>>;
// }

