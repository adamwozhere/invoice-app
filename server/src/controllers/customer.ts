import { Request, Response } from 'express';

import {
  createCustomer,
  deleteCustomerById,
  getAllCustomers,
  getCustomerById,
} from '../services/customerService';

import { CustomerInput } from '../schemas/customer.schema';

// import logger from '../utils/logger';

// TODO: remove ['body'] from CustomerInput as I don't think I will need to pass params also.
// TODO: refactor to bea separate function rather in the route e.g. routes will just have router.post('/', validate(customerSchea), handleCustomer)
// then define the handleCustomer RequestHandler in the contoller (not the api .get, .post etc.)
// TODO: custom error so I can handle sending the responses from the controller? e.g. for when there are no customers, or invoices (althogh maybe that is not an error)
// TODO: handle formatting error responses universally so they are uniform in shape. e.g. for mongoose errors when zod schema is parsed but mongoose schema fails (test by not requiring customer address in zod schema)

export const getAllCustomersHandler = async (req: Request, res: Response) => {
  const customers = await getAllCustomers();
  if (customers.length === 0) {
    return res.status(404).json({ error: 'No customers found' });
  }

  return res.json(customers);
};

export const getCustomerHandler = async (
  req: Request<{ id: string }, object, object>,
  res: Response
) => {
  const customer = await getCustomerById(req.params.id);

  if (!customer) {
    return res.status(404).end();
  }

  return res.json(customer);
};

export const postCustomerHandler = async (
  req: Request<object, object, CustomerInput['body']>,
  res: Response
) => {
  const customer = await createCustomer(req.body);
  return res.status(201).json(customer);
};

export const deleteCustomerHandler = async (
  req: Request<{ id: string }, object, object>,
  res: Response
) => {
  const deleted = await deleteCustomerById(req.params.id);
  if (!deleted) {
    return res.status(404).end();
  }

  return res.status(204).json(deleted);
};

