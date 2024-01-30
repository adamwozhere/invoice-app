export const customers = [
  {
    name: 'Sherlock Holmes',
    email: 'sherlock@baker-st.com',
    address: {
      line1: '221B Baker St',
      line2: 'Marylebone',
      city: 'London',
      postcode: 'NW1 6XE',
    },
    id: '',
  },
  {
    name: 'John Watson',
    email: 'john@baker-st.com',
    address: {
      line1: '221B Baker St',
      line2: 'Marylebone',
      city: 'London',
      postcode: 'NW1 6XE',
    },
    id: '',
  },
];

export const invoices = [
  {
    date: new Date('12-12-2023'),
    paymentTerms: 28,
    status: 'pending',
    customer: '',
    items: [
      { quantity: 1, description: 'item 1', amount: 9.99 },
      { quantity: 10, description: 'item 2', amount: 0.99 },
    ],
    invoiceNumber: 1,
  },
  {
    date: new Date('12-12-2023'),
    paymentTerms: 30,
    status: 'draft',
    customer: '',
    items: [{ quantity: 10, description: 'item 1', amount: 14.99 }],
    invoiceNumber: 2,
  },
  {
    date: new Date('12-12-2023'),
    paymentTerms: 31,
    status: 'paid',
    customer: '',
    items: [
      { quantity: 150, description: 'item 1', amount: 2.99 },
      { quantity: 300, description: 'item 2', amount: 12.49 },
      { quantity: 1, description: 'item 3', amount: 24.49 },
    ],
    invoiceNumber: 3,
  },
];
