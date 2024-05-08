// import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useInvoices from '../hooks/useInvoices';
import BackButton from '../components/ui/BackButton';
import BackIcon from '../components/icons/BackIcon';

export default function Index() {
  const { user } = useAuth();
  const { data, error, isLoading } = useInvoices();

  const pendingInvoices = data?.filter((inv) => inv.status === 'pending');

  // TODO: implement getting number of pending invoices, and if no invoices, then message to create?

  if (error) {
    return <p>Something went wrong...</p>;
  }

  return (
    <div className="max-w-5xl w-full">
      <div className="bg-gray-200">
        <div className="bg-white rounded-b-xl px-6 py-8 mb-6">
          <h1 className="text-3xl font-extrabold text-zinc-600">
            Welcome back, <span className="text-green-400">{user?.name}</span>
            &nbsp;!
          </h1>
          {isLoading ? (
            <div className="h-24 -mt-1"></div>
          ) : (
            <h2 className="text-xl my-8">
              You have&nbsp;
              <span className="font-extrabold text-black">
                {pendingInvoices?.length}
              </span>
              &nbsp;pending invoices.
            </h2>
          )}
          <BackButton
            to="/invoices"
            label="View invoices"
            icon={<BackIcon />}
          />
        </div>
      </div>
    </div>
  );
}

