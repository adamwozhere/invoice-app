import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Route, Routes } from 'react-router-dom';
// routes
import AuthProvider from './providers/AuthProvider';
import Layout from './layouts/Layout';
import Index from './routes/Index';
import Login from './routes/Login';
import Invoices from './routes/Invoices';
import Invoice from './routes/Invoice';
import Customers from './routes/Customers';
import RequireAuth from './layouts/RequireAuth';
import EditInvoice from './routes/EditInvoice';
import Customer from './routes/Customer';
import EditCustomer from './routes/EditCustomer';
import NewCustomer from './routes/NewCustomer';

import type { HttpError } from './types/HttpError';
import NewInvoice from './routes/NewInvoice';

// create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: HttpError) => {
        // never retry on 403,
        // let auth refresh accessToken then retry
        if (error.response?.status === 403) {
          return false;
        }
        // otherwise retry twice
        return failureCount <= 2;
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // only show an error if there is data in the cache,
      // which indicates a failed background update
      if (query.state.data !== undefined) {
        // TODO: add code for toast error message here
        console.log(`error: something went wrong: ${error.message}`);
      }
    },
  }),
});

// TODO: add query dev tools
// App routes
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route element={<RequireAuth />}>
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/invoices/new" element={<NewInvoice />} />
              <Route path="/invoices/:invoiceId" element={<Invoice />} />
              <Route
                path="/invoices/:invoiceId/edit"
                element={<EditInvoice />}
              />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/new" element={<NewCustomer />} />
              <Route path="/customers/:customerId" element={<Customer />} />
              <Route
                path="/customers/:customerId/edit"
                element={<EditCustomer />}
              />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

