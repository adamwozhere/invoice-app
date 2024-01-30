import Invoice from '../models/invoice.model';
import { CustomerDocument } from '../models/customer.model';

// TODO: check queries / sanitizing
// see:
// Don't do this!
//const docs = await MyModel.find(req.query);

// Do this instead:
//const docs = await MyModel.find({ name: req.query.name, age: req.query.age }).setOptions({ sanitizeFilter: true });

export async function getAllInvoices() {
  // const invoice = await Invoice.find({}).populate<{
  //   customer: CustomerDocument;
  // }>('customer');
  const invoice = await Invoice.find({}).sort('invoiceNumber').populate<{
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

export const createInvoice = async (data: object) => {
  const invoice = new Invoice(data);
  await invoice.save();
  return invoice.populate<{ customer: CustomerDocument }>('customer');
};

export const deleteInvoiceById = async (id: string) => {
  const deleted = await Invoice.findByIdAndDelete(id);
  console.log('DELETED', deleted);
  return deleted;
};

export const editInvoiceById = async (id: string, data: object) => {
  // const edited = await Invoice.findByIdAndUpdate(id, data, {
  //   returnDocument: 'after',
  // });
  const edited = await Invoice.findOneAndReplace({ _id: id }, data, {
    returnDocument: 'after',
  });
  return edited;
};

