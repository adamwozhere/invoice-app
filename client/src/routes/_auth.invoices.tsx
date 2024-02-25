import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getInvoices } from '../api/getInvoices';

const invoicesQueryOptions = queryOptions({
  queryKey: ['invoices'],
  queryFn: getInvoices,
});

export const Route = createFileRoute('/_auth/invoices')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(invoicesQueryOptions),
  component: Invoices,
  pendingComponent: Pending,
});

// export const Route = createFileRoute('/_auth/invoices')({
//   loader: ({ context: { queryClient, auth }}) =>
//     queryClient.ensureQueryData(queryOptions({
//       queryKey: ['invoices'],
//       queryFn: useFetchInvoices
//     })),
//     component: Invoices
//   }
// })

function Pending() {
  return (
    <div>
      <p>Loading...</p>
    </div>
  );
}

function Invoices() {
  const auth = useAuth();

  const invoicesQuery = useSuspenseQuery(invoicesQueryOptions);
  const invoices = invoicesQuery.data;

  console.log(invoices);

  return (
    <div>
      <h1>Welcome to the invoices page {auth.auth?.email} !</h1>

      <pre> json: {JSON.stringify(invoices, null, 2)}</pre>
      {/* <pre> query: {JSON.stringify(invoicesQueryData, null, 2)}</pre> */}
    </div>
  );
}

