import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import {
  createInvoice,
  deleteInvoiceById,
  editInvoiceById,
  getAllInvoices,
  getInvoiceById,
} from '../services/invoiceService';
import {
  CreateInvoiceInput,
  DeleteInvoiceInput,
  EditInvoiceInput,
  GetInvoiceByIdInput,
} from '../schemas/invoice.schema';
import User from '../models/user.model';

const getTokenFrom = (req: Request) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }

  return 'null';
};

export const getAllInvoicesHandler = async (_req: Request, res: Response) => {
  const invoices = await getAllInvoices();
  return res.send(invoices);
};

export const getInvoiceHandler = async (
  req: Request<GetInvoiceByIdInput['params'], object, object>,
  res: Response
) => {
  const invoice = await getInvoiceById(req.params.id);

  // TODO: don't know if this should return an actual message or not
  if (!invoice) {
    return res.status(404).json({ message: 'Invoice not found' });
  }

  // TODO: validate the id param in the route beforehand?
  return res.json(invoice);
};

export const postInvoiceHandler = async (
  req: Request<object, object, CreateInvoiceInput['body']>,
  res: Response
) => {
  const decodedToken = jwt.verify(getTokenFrom(req), 'secret');
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' });
  }
  const user = await User.findById(decodedToken.id);

  const invoice = await createInvoice({ ...req.body, user });
  return res.status(201).json(invoice);
};

export const deleteInvoiceHandler = async (
  req: Request<DeleteInvoiceInput['params'], object, object>,
  res: Response
) => {
  const deleted = await deleteInvoiceById(req.params.id);

  if (!deleted) {
    return res.status(404).end();
  }

  return res.status(204).end();
};

export const putInvoiceByIdHandler = async (
  req: Request<EditInvoiceInput['params'], object, EditInvoiceInput['body']>,
  res: Response
) => {
  const edited = await editInvoiceById(req.params.id, req.body);

  if (!edited) {
    return res.status(404).end();
  }
  return res.json(edited);
};

