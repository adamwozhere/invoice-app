import axios, { AxiosError } from 'axios';
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
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (auth && auth.accessToken) {
          config.headers.Authorization = `Bearer ${auth.accessToken}`;
        }
        return config;
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
        const prevReq = error.config;

        console.log('interceptor response prevReq:', JSON.stringify(prevReq));
        console.log('interceptor status', JSON.stringify(error));

        if (prevReq && error.response?.status === 403) {
          console.log('refreshing token');
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
          return axios.request(prevReq);
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

