import { CustomerDocument } from '../models/customer.model';
import Invoice, {
  InvoiceDocument,
  InvoiceInput,
} from '../models/invoice.model';
import { UserDocument } from '../models/user.model';

// TODO: check queries / sanitizing
// see:
// Don't do this!
//const docs = await MyModel.find(req.query);

// Do this instead:
//const docs = await MyModel.find({ name: req.query.name, age: req.query.age }).setOptions({ sanitizeFilter: true });

export const getInvoices = async (user: UserDocument | undefined) => {
  // TODO: look at the docus for using PopulatedDoc
  // const invoice = await Invoice.find({}).populate<{
  //   customer: CustomerDocument;
  // }>('customer');
  console.log('getInvoices, user:', user?.id);
  const populated = await user?.populate({
    path: 'invoices',
    populate: { path: 'customer' },
  });
  console.log('populated: ', JSON.stringify(populated));
  return populated?.invoices;
};

export const getSingleInvoice = async (
  user: UserDocument | undefined,
  invoiceId: string
) => {
  const populated = await user?.populate({
    path: 'invoices',
    match: { _id: invoiceId },
    populate: { path: 'customer' },
  });

  return populated?.invoices[0];
};

export const createInvoice = async (user: UserDocument, data: InvoiceInput) => {
  const invoice = await Invoice.create(data);
  user.invoices = user.invoices.concat(invoice._id);
  await user.save();

  return invoice.populate('customer');
};

export async function updateInvoiceById(id: string, data: object) {
  const invoice = await Invoice.findByIdAndUpdate(id, data).populate<{
    customer: CustomerDocument;
  }>('customer');
  return invoice;
}

export const deleteInvoiceById = async (user: UserDocument, id: string) => {
  const foundInvoice = user.invoices.find((i) => i?.toString() === id);
  if (!foundInvoice) {
    return null;
  }
  const deleted = await Invoice.findOneAndDelete<InvoiceDocument>({
    _id: id,
  });

  // remove invoice form user.invoices
  user.invoices = user.invoices.filter((i) => i?.toString() !== id);
  await user.save();

  return deleted;
};

export const editInvoiceById = async (
  user: UserDocument,
  id: string,
  data: InvoiceInput
) => {
  const foundInvoice = user.invoices.find((i) => i?.toString() === id);
  if (!foundInvoice) {
    return null;
  }

  const invoice = await Invoice.findOneAndUpdate({ _id: id }, data, {
    returnedDocument: 'after',
  });

  return invoice;
};

