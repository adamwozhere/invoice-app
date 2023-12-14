import Customer, {
  CustomerDocument,
  CustomerInput,
} from '../models/customer.model';

export const getAllCustomers = async () => {
  const customers = await Customer.find<CustomerDocument>({});
  return customers;
};

export const getCustomerById = async (id: string) => {
  const customer = await Customer.findById<CustomerDocument>(id);
  return customer;
};

// TODO: work out best method of returning the objects
// using Customer.find<CustomerDocument>() works and tells typescript it's the interface only
// (although the mongoose Document methods and properties are actually on the object)
// however I can't seem to do this for the create function as it still returns it as a Document type with the Interface
// but perhaps I don't need to type these and just use the inferred values, now that I am typing the Models correctly with the interface
export const createCustomer = async (data: CustomerInput) => {
  // const customer = new Customer(data);
  // await customer.save();
  // return customer;
  const customer = await Customer.create<CustomerInput>(data);
  return customer as CustomerDocument;
};

export const deleteCustomerById = async (id: string) => {
  const deleted = await Customer.findOneAndDelete<CustomerDocument>({
    _id: id,
  });
  return deleted;
};

// createCustomer({
//   name: 'bob',
//   email: 'bob@hotmail.com',
//   address: {
//     line1: '123 park st',
//     city: 'London',
//     postcode: 'LN10',
//   }
// })
//   .then(() => console.log(''))
//   .catch((er) => console.error(er));

