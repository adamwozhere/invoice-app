import mongoose, { Schema } from 'mongoose';

// TODO: check and investigate if my customer property should be ObjectId or string
// the interface represents the Document as it is in mongoose,
// however when creating an invoice and adding a customer it is passed as a string.
// check if providing string to a ObjectId is compatible

export interface CustomerDocument {
  name: string;
  email: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    county?: string;
    postcode: string;
  };
  id: string; // mongoose virtual: string version of ObjectId
}

// TODO: do I need this or is it just the one from zod I need?
export type CustomerInput = Omit<CustomerDocument, 'id'>;

const addressSchema = new Schema(
  {
    line1: {
      type: String,
      required: true,
    },
    line2: String,
    city: {
      type: String,
      required: true,
    },
    county: String,
    postcode: {
      type: String,
      required: true,
      uppercase: true,
    },
  },
  {
    _id: false,
  }
);

const customerSchema = new Schema<CustomerDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: addressSchema,
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

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;

