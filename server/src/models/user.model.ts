import mongoose, { Document, Schema, Types } from 'mongoose';
import { InvoiceDocument } from './invoice.model';

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    county?: string;
    postcode: string;
  };
  // bank details?
  id: string; // mongoose virtual: string version of ObjectId
  invoices: Array<InvoiceDocument>;
  totalInvoices: number;
  latestInvoiceNumber: number;
  refreshToken: string;
}

// TODO: this is also in customer so should probably have this in a separate file?
// technically there should also be bank details too though
// NOTE: may not wis to save a users address - as it would be populated in an invoice,
// this would mean that if an address is changed it would than affect pre-existing invoices which would not be desired.
// either save address version histories?
// or save the address directly in the invoice: but could keep a user address as a 'last used address' for pre-populating invoice fields?
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

// TODO: do I need this or is it just the one from zod I need?
export type UserInput = Pick<UserDocument, 'name' & 'email' & 'address'>;

// TODO: where do I put the password / confirm password, or is that only in the zod schema (as that is input not returned mongoose document)

const userSchema = new Schema<UserDocument>(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true, // need to add mongoose-unique-validator
    },
    passwordHash: String,
    address: addressSchema,
    invoices: [
      {
        type: Types.ObjectId,
        ref: 'Invoice',
      },
    ],
    totalInvoices: Number,
    latestInvoiceNumber: Number,
    refreshToken: String,
    //id: String, // NOTE: tried to solve auth controller not recognising id as string: inferred type doesn't seem to work, have called User.findOne<UserDocument>({}) to get it to use type correctly
  },
  {
    toJSON: {
      virtuals: true,
      transform: (_document, returned) => {
        delete returned._id;
        delete returned.__v;
        delete returned.passwordHash;
      },
    },
  }
);

// TODO: hash the password on pre save

const User = mongoose.model('User', userSchema);

export default User;

