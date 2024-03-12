export type Invoice = {
  invoiceNumber: number;
  date: Date;
  paymentTerms: number;
  status: string;
  customer: object;
  items: object;
  total: number;
  due: Date;
  id: string;
  user: string;
};

