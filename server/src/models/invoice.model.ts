import mongoose, { Schema, Document, Types } from 'mongoose';
import dayjs from 'dayjs';

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
  date: Date;
  paymentTerms: number;
  status: InvoiceStatus;
  customer: Types.ObjectId; // use Types.ObjectId in interfaces TODO: should this just be a string?
  items: Types.DocumentArray<ItemDocument>; // use Types.DocumentArray<> in interfaces
  total: number;
  due: Date;
  id: string; // mongoose virtual: string version of ObjectId
}

export type InvoiceInput = Omit<InvoiceDocument, 'id' | 'total' | 'due'> & {
  items: Types.DocumentArray<ItemInput>;
};

const invoice = new Schema<InvoiceDocument>(
  {
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
  const days: number = this.paymentTerms;
  return dayjs(date).add(days, 'days').toDate();
});

const Invoice = mongoose.model('Invoice', invoice);

export default Invoice;

