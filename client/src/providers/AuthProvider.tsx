import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, refreshAccessToken } from '../api/auth';

interface AuthContextType {
  user: {
    email: string;
    accessToken: string;
    isAuthenticated: boolean;
  } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

axios.defaults.withCredentials = true;

export const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    email: string;
    accessToken: string;
    isAuthenticated: boolean;
  } | null>(null);

  // TODO: how to make this automatic
  if (user) {
    user.isAuthenticated = !!user;
  }
  // useCallback ????
  // const logout = () => {
  //   setUser(null);
  //   navigate('/');
  // };

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${user?.accessToken}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      // response in 2xx range
      (response) => response,
      // response outside 2xx range
      async (error: AxiosError) => {
        if (error.config) {
          const prevRequest: InternalAxiosRequestConfig & { sent?: boolean } =
            error.config;

          if (error?.response?.status === 403 && !prevRequest.sent) {
            prevRequest.sent = true;

            try {
              const token = await refreshAccessToken();

              setUser((prev) => ({
                email: prev?.email ?? '',
                accessToken: token,
                isAuthenticated: true,
              }));

              prevRequest.headers.Authorization = `Bearer ${token}`;
              return axios.request(prevRequest);
            } catch (err) {
              console.log('could not refresh access token');
              setUser(null);
            }
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const user = await loginUser(email, password);
      setUser({
        email: user.email,
        accessToken: user.accessToken,
        isAuthenticated: true,
      });
      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

