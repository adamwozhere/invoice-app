import mongoose, { Schema, Document } from 'mongoose';

export interface CounterDocument extends Document {
  name: string; // user-friendly identifier
  currentId: string | null;
  current: number; // This is actually the current invocice count / number NOT the next number
}

const counters = new Schema<CounterDocument>({
  name: String,
  currentId: String, // this won't be needed just the current/latest invoice number, and could put in a totalInvoices number
  current: { type: Number, default: 0 },
});

// probably better to have a function in here to .getNextInvoiceNumber() etc.

const Counters = mongoose.model('Counters', counters);
export default Counters;

