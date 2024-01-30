import Customer, {
  CustomerDocument,
  CustomerInput,
} from '../models/customer.model';
import Invoice from '../models/invoice.model';
// import logger from './logger';

// export const getFirstCustomer = async () => {
//   const customers = await Customer.find<CustomerDocument>({});
//   logger.info(JSON.stringify(customers[0], null, 2));
//   return customers[0];
// };
const customer = {
  name: 'Sherlock Holmes',
  email: 'sherlock@baker-st.com',
  address: {
    line1: '221B Baker St',
    line2: 'Marylebone',
    city: 'London',
    postcode: 'NW1 6XE',
  },
  id: '',
};

const invoices = [
  {
    date: new Date('12-12-2023'),
    paymentTerms: 28,
    status: 'pending',
    customer: null,
    items: [
      { quantity: 1, description: 'item 1', amount: 9.99 },
      { quantity: 10, description: 'item 2', amount: 0.99 },
    ],
    id: '',
  },
  {
    date: new Date('12-12-2023'),
    paymentTerms: 31,
    status: 'draft',
    customer: null,
    items: [{ quantity: 5, description: 'item 1', amount: 299 }],
    id: '',
  },
  {
    date: new Date('12-12-2023'),
    paymentTerms: 21,
    status: 'paid',
    customer: null,
    items: [
      { quantity: 150, description: 'item 1', amount: 2.99 },
      { quantity: 200, description: 'item 2', amount: 11.99 },
      { quantity: 1, description: 'item 3', amount: 14.99 },
    ],
    id: '',
  },
];

// TODO: construct a separate input and output objects
// might be better to just create an output object with spread operator and the customer replaced in it
// could export a separate smaller object that has just the items with the calculated total virtuals to compare for specific tests?
// or when testing against that I use one invoice that only has ONE specific item in the array, as I then don't need to worry about loops
// and if it works for one item it would work for all
// however this may not test calculating the total of the invoice as it would be better to have multiple items
// Check with vitest docs that you can do looped expect() tests

// could also export all this to be included in the testServer object from db.ts
// or have a separate testServer.ts util, and then include that in the db.ts object
// or move testServer completely out of it ?
// or not, and just have a separate testService util and keep it separate from the actually db connection (probably better)

export const seedDatabase = async () => {
  const obj = await Customer.create(customer);
  customer.id = obj.id as string;

  invoices.forEach((inv) => (inv.customer = customer.id as string));

  const objs = await Invoice.create(invoices);

  invoices.forEach((inv, i) => {
    inv.id = objs[i]?.id as string;
    inv.customer = customer;
  });

  // return invoices input and output
  // and customer input and output objects here ?
};

// export another function to clear the database?

