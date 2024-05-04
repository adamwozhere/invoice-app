import { Link, NavLink, useSearchParams } from 'react-router-dom';
import useInvoices from '../hooks/useInvoices';
import formatDate from '../utils/formatDate';
import StatusPill from '../components/ui/StatusPill';
import formatCurrency from '../utils/formatCurrency';
import formatInvoiceNumber from '../utils/formatInvoiceNumber';
import SortIon from '../components/icons/SortIcon';
import Invoice from './Invoice';
import PlusIcon from '../components/icons/PlusIcon';
import Button from '../components/ui/Button';

export default function Invoices() {
  const { data, error, isLoading } = useInvoices();

  const [params] = useSearchParams();
  let filter = params.get('filter');
  let sort = params.get('sort');
  let order = params.get('order');

  // TODO: set default to all -- doesn't work
  if (filter === null) {
    filter = 'all';
  }
  if (sort === null) {
    sort = 'invoice';
  }

  if (order === null) {
    order = 'asc';
  }

  if (error) {
    return <p>Something went wrong...</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const invoices =
    filter === 'all' ? data : data?.filter((inv) => inv.status === filter);

  const sortKeys: Record<string, string> = {
    invoice: 'invoiceNumber',
    date: 'date',
    customer: 'customer.name',
    total: 'total',
    status: 'status',
  };

  const sortKey = sortKeys[sort];

  invoices?.sort((a, b) =>
    order === 'asc'
      ? a[sortKey as keyof typeof Invoice] - b[sortKey as keyof typeof Invoice]
      : b[sortKey as keyof typeof Invoice] - a[sortKey as keyof typeof Invoice]
  );

  return (
    <div className="max-w-5xl w-full">
      <div className="sticky top-0 bg-gray-200">
        <div className="bg-white rounded-b-xl px-6 py-2 pt-8 mb-6">
          <h1 className="text-3xl font-extrabold text-zinc-600">Invoices</h1>
          <div className="flex items-center gap-8 my-4 mt-8">
            <NavLink
              to="/invoices?filter=all"
              className={
                filter === 'all'
                  ? 'font-extrabold text-black underline underline-offset-[2rem] decoration-8'
                  : 'font-extrabold text-zinc-400'
              }
            >
              All invoices
            </NavLink>
            <NavLink
              to="/invoices?filter=pending"
              className={
                filter === 'pending'
                  ? 'font-extrabold text-black underline underline-offset-[2rem] decoration-8'
                  : 'font-extrabold text-zinc-400'
              }
            >
              Pending
            </NavLink>
            <NavLink
              to="/invoices?filter=paid"
              className={
                filter === 'paid'
                  ? 'font-extrabold text-black underline underline-offset-[2rem] decoration-8'
                  : 'font-extrabold text-zinc-400'
              }
            >
              Paid
            </NavLink>
            <NavLink
              to="/invoices?filter=draft"
              className={
                filter === 'draft'
                  ? 'font-extrabold text-black underline underline-offset-[2rem] decoration-8'
                  : 'font-bold text-zinc-400'
              }
            >
              Draft
            </NavLink>
            <NavLink
              to="new"
              className="ml-auto inline-flex h-10 px-4 py-2 items-center justify-center whitespace-nowrap rounded-lg text-md font-bold bg-green-400 text-black hover:bg-opacity-70 transition-colors"
            >
              <PlusIcon /> New invoice
            </NavLink>
          </div>
        </div>
        <div className="grid grid-cols-5 px-6 py-4 font-bold bg-white text-zinc-400 text-xs gap-4 mb-[2px] uppercase rounded-t-xl border-b-2 border-gray-200">
          <h3 id="invoice-number flex">
            <Link
              className="inline-flex gap-1"
              to={`?filter=${filter}&sort=invoice&order=${
                order === 'asc' ? 'desc' : 'asc'
              }`}
            >
              Invoice number <SortIon />
            </Link>
          </h3>
          <h3 id="invoice-date">
            <Link
              className="inline-flex gap-1"
              to={`?filter=${filter}&sort=date&order=${
                order === 'asc' ? 'desc' : 'asc'
              }`}
            >
              Date <SortIon />
            </Link>
          </h3>
          <h3 id="invoice-customer">
            <Link
              className="inline-flex gap-1"
              to={`?filter=${filter}&sort=customer&order=${
                order === 'asc' ? 'desc' : 'asc'
              }`}
            >
              Customer <SortIon />
            </Link>
          </h3>
          <h3 id="invoice-total" className="text-end">
            <Link
              className="inline-flex gap-1"
              to={`?filter=${filter}&sort=total&order=${
                order === 'asc' ? 'desc' : 'asc'
              }`}
            >
              Total <SortIon />
            </Link>
          </h3>
          <h3 id="invoice-status" className="text-end">
            <Link
              className="inline-flex gap-1 text-end"
              to={`?filter=${filter}&sort=status&order=${
                order === 'asc' ? 'desc' : 'asc'
              }`}
            >
              Status <SortIon />
            </Link>
          </h3>
        </div>
      </div>
      <ul className="flex flex-col gap-[2px] font-medium text-zinc-600">
        {invoices?.map((inv) => (
          <li key={inv.id}>
            <Link
              to={inv.id}
              className="w-full bg-zinc-100 hover:bg-white px-6 py-4 grid grid-cols-5 gap-4"
            >
              <span aria-describedby="invoice-number">
                <span className="text-zinc-400">#</span>{' '}
                {formatInvoiceNumber(inv.invoiceNumber)}
              </span>
              <span aria-describedby="invoice-date">
                {formatDate(inv.date)}
              </span>
              <span
                aria-describedby="invoice-customer"
                className="text-zinc-400"
              >
                {inv.customer?.name}
              </span>
              <span aria-describedby="invoice-total" className="text-end">
                {formatCurrency(inv.total)}
              </span>
              <span aria-describedby="invoice-status" className="text-end">
                <StatusPill status={inv.status} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="h-6 bg-zinc-100 rounded-b-xl mt-[2px] mb-20"></div>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
}

