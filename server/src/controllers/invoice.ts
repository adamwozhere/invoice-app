import { Request, Response } from 'express';

import { createInvoice, getAllInvoices } from '../services/invoiceService';
import { InvoiceInput } from '../schemas/invoice.schema';

export const getAllInvoicesHandler = async (_req: Request, res: Response) => {
  const invoices = await getAllInvoices();
  return res.send(invoices);
};

export const postInvoiceHandler = async (
  req: Request<object, object, InvoiceInput['body']>,
  res: Response
) => {
  const invoice = await createInvoice(req.body);
  return res.status(201).json(invoice);
};

