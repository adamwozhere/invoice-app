import mongoose, { Schema, Document, Types } from 'mongoose';
import dayjs from 'dayjs';
import Counters from './counters.model';

// TODO: check and investigate if my customer property should be ObjectId or string
// the interface represents the Document as it is in mongoose,
// however when creating an invoice and adding a customer it is passed as a string.
// check if providing string to a ObjectId is compatible

/**
 * ITEM document
 */
export interface ItemDocument extends Document {
  quantity: number;
  description: string;
  amount: number;
  total: number;
  id: string; // mongoose virtual: string version of ObjectId
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

export interface InvoiceDocument extends Document {
  invoiceNumber: number;
  date: Date;
  paymentTerms: number;
  status: InvoiceStatus;
  customer: Types.ObjectId; // use Types.ObjectId in interfaces TODO: should this just be a string?
  items: Types.DocumentArray<ItemDocument>; // use Types.DocumentArray<> in interfaces
  total: number;
  due: Date;
  id: string; // mongoose virtual: string version of ObjectId
  // TODO: add user to invoice document and invoices to user document
  user: Types.ObjectId;
}

// TODO: investigate InvoiceInput type, as I'm not sure where this is now used - and there's also an InvoiceInput in the Zod schema file!

export type InvoiceInput = Omit<InvoiceDocument, 'id' | 'total' | 'due'> & {
  items: Types.DocumentArray<ItemInput>;
};

const invoice = new Schema<InvoiceDocument>(
  {
    invoiceNumber: {
      type: Number,
      unique: true,
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
    // TODO: implement user
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
  const nextNumber = await Counters.findOneAndUpdate(
    { name: 'counter' },
    { $inc: { current: 1 }, currentId: this.id as string },
    { returnDocument: 'after' }
  );
  if (!nextNumber) {
    throw Error('counter document undefined');
  }

  this.invoiceNumber = nextNumber.current;
  next();
});

invoice.post('findOneAndDelete', async function (doc: InvoiceDocument) {
  const counter = await Counters.findOne({ name: 'counter' });

  if (doc && counter && doc.invoiceNumber === counter?.current) {
    counter.current -= 1;
    await counter.save();
  }
});

const Invoice = mongoose.model('Invoice', invoice);

export default Invoice;

