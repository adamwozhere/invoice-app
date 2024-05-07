import type { Customer } from '../types/Customer';

export default function CustomerDetail({ customer }: { customer: Customer }) {
  if (!customer) {
    return <p>pending...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-zinc-600 mb-8">Customer</h1>
      <h2 className="font-bold">{customer.name}</h2>
      <p>{customer.email}</p>
      <address className="not-italic">
        {customer.address.line1}
        <br />
        {customer.address.line2}
        <br />
        {customer.address.city}
        <br />
        {customer.address.county}
        <br />
        {customer.address.postcode}
        <br />
      </address>
    </div>
  );
}

