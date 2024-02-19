import mongoose, { Schema, Types } from 'mongoose';
import dayjs from 'dayjs';
import { UserDocument } from './user.model';
// import User, { UserDocument } from './user.model';

// TODO: check and investigate if my customer property should be ObjectId or string
// the interface represents the Document as it is in mongoose,
// however when creating an invoice and adding a customer it is passed as a string.
// check if providing string to a ObjectId is compatible

/**
 * ITEM document
 */
// this did have extends Document
export interface ItemDocument {
  quantity: number;
  description: string;
  amount: number;
  total: number;
  // id: string; // mongoose virtual: string version of ObjectId
}

export type ItemInput = Omit<ItemDocument, 'id' | 'total'>;

const item = new Schema<ItemDocument>(
  {
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (_document, returned) => {
        delete returned._id;
        delete returned.__v;
      },
    },
  }
);

item.virtual('total').get(function () {
  return this.amount * this.quantity;
});

/**
 * INVOICE document
 */
export type InvoiceStatus = 'draft' | 'pending' | 'paid';

export interface InvoiceDocument {
  invoiceNumber: number;
  date: Date;
  paymentTerms: number;
  status: InvoiceStatus;
  // customer: PopulatedDoc<CustomerDocument>;
  // customer: Types.ObjectId,
  customer: Types.ObjectId; // use Types.ObjectId in interfaces TODO: should this just be a string?
  items: Array<ItemDocument>; // use Types.DocumentArray<> in interfaces
  // items: ItemDocument[]; // use Types.DocumentArray<> in interfaces
  total: number;
  due: Date;
  id: string; // mongoose virtual: string version of ObjectId
  // TODO: add user to invoice document and invoices to user document
  user: Types.ObjectId;
}

// TODO: investigate InvoiceInput type, as I'm not sure where this is now used - and there's also an InvoiceInput in the Zod schema file!

export type InvoiceInput = Pick<
  InvoiceDocument,
  'date' | 'paymentTerms' | 'status'
> & {
  user: string;
  customer: string;
  items: Array<ItemInput>;
};

// TODO: work out invoice numbering method
/**
 * pre-save hook was working by post findOneAndDelete didn't give me access to this.user to get the counter,
 * also the unique field for the invoiceNumber was causing duplicate values - race condition in tests?
 * - may be better to just have invoice number non-unique, and either auto increment in model,
 * or have manual input into model, but pre/post save, update the user document with lastInvoiceNumber,
 * client can then use this to auto-increment and send by default (or user can edit it?)
 * - check how other apps handle invoice number sequencing!
 *
 * SAGE 50: sage invoicing assigns numbers at time of prinding or emailing them (also allows you to number emailed one differently from printed ones???)
 * they are sequentially incremented but you can also enter a number,
 * it will warn you if the number has been used
 *
 * easiest way probably is to have a lastInvoiceNumber set to default 0 on the User doc
 * client increments and sends in json,
 * model does pre/post save to user.lastInvoiceNumber
 * model has the invoice number as unique
 * hopefull the clientside useQuery will auto update the user data,
 * can always have extra stuff like virtual for user.totalInvoices etc.
 *
 * NOTE: will need to update zod schema for invoiceNumber, and do validation tests for these
 */

const invoice = new Schema<InvoiceDocument>(
  {
    invoiceNumber: {
      type: Number,
      required: true,
      default: 0,
    },
    date: {
      type: Date,
      required: true,
    },
    paymentTerms: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId, // use Schema.Types.ObjectId in Schemas
      ref: 'Customer',
      required: true,
    },
    items: {
      type: [item],
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (_document, returned) => {
        delete returned._id;
        delete returned.__v;
      },
    },
  }
);

invoice.virtual('total').get(function () {
  return this.items.reduce((sum, item) => sum + item.total, 0);
});

invoice.virtual('due').get(function () {
  const date: Date = this.date;
  const days = this.paymentTerms;
  return dayjs(date).add(days, 'days').toDate();
});

invoice.pre('save', async function (next) {
  const user = await this.model('User').findByIdAndUpdate<UserDocument>(
    this.user,
    { $inc: { invoiceCounter: 1 } },
    { returnDocument: 'after' }
  );
  this.invoiceNumber = user?.invoiceCounter ?? 0;

  next();
});

// invoice.post('findOneAndDelete', async function (doc: InvoiceDocument) {
//   const counter = await Counters.findOne({ name: 'counter' });

//   if (doc && counter && doc.invoiceNumber === counter?.current) {
//     counter.current -= 1;
//     await counter.save();
//   }
// });

const Invoice = mongoose.model('Invoice', invoice);

export default Invoice;

