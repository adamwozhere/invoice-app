import Customer, { CustomerDocument } from '../models/customer.model';
import logger from './logger';

export const getFirstCustomer = async () => {
  const customers = await Customer.find<CustomerDocument>({});
  logger.info(JSON.stringify(customers[0], null, 2));
  return customers[0];
};

