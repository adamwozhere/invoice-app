import Invoice from '../models/invoice.model';
import { CustomerDocument } from '../models/customer.model';

export async function getAllInvoices() {
  const invoice = await Invoice.find({}).populate<{
    customer: CustomerDocument;
  }>('customer');
  return invoice;
}

export async function getInvoiceById(id: string) {
  const invoice = await Invoice.findById(id).populate<{
    customer: CustomerDocument;
  }>('customer');
  return invoice;
}

export async function updateInvoiceById(id: string, data: object) {
  const invoice = await Invoice.findByIdAndUpdate(id, data).populate<{
    customer: CustomerDocument;
  }>('customer');
  return invoice;
}

export async function deleteInvoiceById(id: string) {
  await Invoice.findByIdAndDelete(id);
}

export const createInvoice = async (data: object) => {
  const invoice = new Invoice(data);
  await invoice.save();
  return invoice.populate<{ customer: CustomerDocument }>('customer');
};

