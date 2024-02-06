/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import supertest from 'supertest';
import {
  afterAll,
  beforeAll,
  afterEach,
  describe,
  test,
  expect,
  beforeEach,
} from 'vitest';
import db from '../utils/db';
import app from '../app';
import Customer from '../models/customer.model';
import Invoice, { InvoiceDocument } from '../models/invoice.model';
import { omit } from 'lodash';
import dayjs from 'dayjs';

const api = supertest(app);

beforeAll(async () => {
  await db.testServer.start();
});

afterEach(async () => {
  // await db.testServer.reset();
});

afterAll(async () => {
  await db.testServer.stop();
});

const customer = {
  name: 'Sherlock Holmes',
  email: 'sherlock@baker-st.com',
  address: {
    line1: '221B Baker St',
    line2: 'Marylebone',
    city: 'London',
    postcode: 'NW1 6XE',
  },
  id: '',
};

const invoice = {
  // date: '2023-12-12T00:00:00.000Z',
  date: new Date('12-12-2023'),
  paymentTerms: 28,
  status: 'pending',
  customer: null,
  items: [
    { quantity: 1, description: 'THIS IS ITEM 1', amount: 9.99 },
    { quantity: 10, description: 'THIS IS ITEM 2', amount: 0.99 },
  ],
};

const invoices = [
  {
    date: new Date('12-12-2023'),
    paymentTerms: 28,
    status: 'pending',
    customer: '',
    items: [
      { quantity: 1, description: 'item 1', amount: 9.99 },
      { quantity: 10, description: 'item 2', amount: 0.99 },
    ],
    invoiceNumber: 1,
  },
  {
    date: new Date('12-12-2023'),
    paymentTerms: 30,
    status: 'draft',
    customer: '',
    items: [{ quantity: 10, description: 'item 1', amount: 14.99 }],
    invoiceNumber: 2,
  },
  {
    date: new Date('12-12-2023'),
    paymentTerms: 31,
    status: 'paid',
    customer: '',
    items: [
      { quantity: 150, description: 'item 1', amount: 2.99 },
      { quantity: 300, description: 'item 2', amount: 12.49 },
      { quantity: 1, description: 'item 3', amount: 24.49 },
    ],
    invoiceNumber: 3,
  },
];
describe('invoices', () => {
  describe('GET /api/invoices', () => {
    beforeAll(async () => {
      await Invoice.deleteMany({});
    });
    test('empty database returns an empty array: 200', async () => {
      const res = await api
        .get('/api/invoices')
        .expect(200)
        .expect('content-type', /application\/json/);

      expect(res.body).toStrictEqual([]);
    });

    // TODO: FIX: test fails intermittently, possibly due to order of documents created / order or documents recieved?
    // or is it the comparison, .toEqual ? it's hard to make sense from the output in console
    // should I just construct an object to compare instead?
    // unsure if this has always been intermittent as only noticed after implementing and testing invoiceNumber sequencesre

    // --poolOptions.threads.singleThread --poolOptions.threads.isolate=false (must be used together otherwise Counter error)
    // --pool=forks --poolOptions.forks.singleFork --poolOptions.forks.isolate=false (must be used together otherwise Counter error)
    // --no-file-parallelism (generally stable other than timing out error? one instance of miss-ordered items)
    // no args: (generally seems stable other than timinging out causing error? one instance of empty body array and counters undefined, one instance of customer.test errors)
    // Generally seems like there is not much different between files, possibly a lot of the errors showing in debug could be to do with timing out?
    // even with single threaded options sometimes responds with 4 invoices which should not be able to happen
    // The problem seems have mainly been the miss-ordering of the awaited Invoice.create(invoices) and the response,
    // hopefully the 4 items error is more to do with timing / in debug mode
    // after testing there seems to be not much difference between options. --no-file-parallelism seems quickest, and all of them can produce 4 items error on debug timeout

    // TODO: to fix: rewrite tests better to access things for comparison close together,
    // put check for response length before invoices equality to see how often extra invoice is apparent,
    // create a seeds file for test objects
    // rewrite test and controller functions to return items always in same order (note: may want descending order for response in future for most recent first)
    // rewrite database function to have a drop/clear database reset function,
    // have each test file, start and stop db at the beginning and end, and reset database after each test,
    // then compare and see if vitest args make a difference

    // TODO: IN-PROGRESS:
    // Have sorted return of docs by invoiceNumber to match the test and seems to work most of the time;
    // one instance of multiple failures, customer test file, Counter failing and mongo connection failure --
    // may be best to ignore this until database function with reset, and all tests unified with setup, reset and close down,
    // and possibly changing Counter to be in a User's document,
    // TODO: make a separate seeds file for test objects,
    // should control test be called litmus test?

    test('database with entries returns all invoices: 200', async () => {
      const { id } = await Customer.create(customer);
      customer.id = id;
      invoices.forEach((inv) => (inv.customer = id as string));

      const output = await Invoice.create(invoices);
      const databaseLength = await Invoice.find({}).populate('customer');
      const res = await api
        .get('/api/invoices')
        .expect(200)
        .expect('content-type', /application\/json/);

      // const output = invoices.map((inv) => new Invoice(inv));

      for (const inv of output) {
        await inv.populate('customer');
      }

      console.log('input', output);

      const expected = JSON.parse(JSON.stringify(output));
      // TODO: NOTE this is partially fixed,
      // sorting output from creating the invoices: will then match with returned sorted invoices from api
      // EXCEPT: for error when database contained 4 not 3 items - database open / close may be needed on EACH test, not beforeALL
      expected.sort(
        (a: InvoiceDocument, b: InvoiceDocument) =>
          a.invoiceNumber - b.invoiceNumber
      );
      console.log('output', expected);

      console.log('response', res.body);
      console.log('databaseLength', databaseLength);

      expect(res.body).toHaveLength(invoices.length);
      expect(res.body).toEqual(expected);
    });

    // test('AFTER database shoult not be emoty', async () => {
    //   const res = await api
    //     .get('/api/invoices')
    //     .expect(200)
    //     .expect('content-type', /application\/json/);r

    //   expect(res.body).toHaveLength(0);
    // });
  });

  describe('GET /api/invoices/:id', () => {
    let invoiceId: string;

    beforeEach(async () => {
      const { id } = await Customer.create(customer);
      customer.id = id;
      invoice.customer = id;

      const createdInvoice = await Invoice.create(invoice);
      await createdInvoice.populate('customer');

      invoiceId = createdInvoice.id;
    });

    afterAll(async () => {
      await Invoice.deleteMany({});
    });

    test('an invoice can be fetched by id: 200', async () => {
      const res = await api
        .get(`/api/invoices/${invoiceId}`)
        .expect(200)
        .expect('content-type', /application\/json/);

      expect(res.body).toBeDefined();
    });

    test('fetched invoice returns expected fields and types', async () => {
      const expected = {
        ...invoice,
        customer,
        date: invoice.date.toISOString(),
        items: expect.arrayContaining([expect.any(Object)]),
        due: expect.any(String),
        total: expect.any(Number),
        invoiceNumber: expect.any(Number),
        id: expect.stringMatching(/^[0-9a-f]{24}$/),
      };

      const res = await api
        .get(`/api/invoices/${invoiceId}`)
        .expect(200)
        .expect('content-type', /application\/json/);

      expect(res.body).toEqual(expected);

      res.body.items.forEach((item: object) =>
        expect(item).toEqual({
          quantity: expect.any(Number),
          description: expect.any(String),
          amount: expect.any(Number),
          total: expect.any(Number),
          id: expect.stringMatching(/^[0-9a-f]{24}$/),
        })
      );
    });

    test('item totals are calculated correctly', async () => {
      const res = await api
        .get(`/api/invoices/${invoiceId}`)
        .expect(200)
        .expect('content-type', /application\/json/);

      for (const item of res.body.items) {
        expect(item.total).toEqual(item.quantity * item.amount);
      }
    });

    test('invoice total is calculated correctly', async () => {
      const res = await api
        .get(`/api/invoices/${invoiceId}`)
        .expect(200)
        .expect('content-type', /application\/json/);

      const invoiceTotal = res.body.items.reduce(
        (sum: number, current: { total: number }) => sum + current.total,
        0
      );

      expect(res.body.total).toEqual(invoiceTotal);
    });

    test('due date is calculated correctly', async () => {
      const res = await api
        .get(`/api/invoices/${invoiceId}`)
        .expect(200)
        .expect('content-type', /application\/json/);

      const dueDate = dayjs(res.body.date as string)
        .add(res.body.paymentTerms as number, 'days')
        .toISOString();

      expect(res.body.due).toEqual(dueDate);
    });

    test('fetching an invoice with malformatted id errors => invalid_string: 400', async () => {
      const res = await api
        .get('/api/invoices/malformattedId')
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'invalid_string' }),
      ]);
    });

    // TODO: get rid of JSON message and just 404 ?
    test('fetching an invoice with an incorrect id errors: 404', async () => {
      const res = await api
        .get('/api/invoices/abcdef0123456789abcdef00')
        .expect(404)
        .expect('content-type', /application\/json/);

      expect(res.body.message).toContain('Invoice not found');
    });
  });

  describe('POST /api/invoices', () => {
    beforeEach(async () => {
      await Invoice.deleteMany({});
    });

    test('creating a valid invoice adds it to the database: 201', async () => {
      const res = await api
        .post('/api/invoices')
        .send(invoice)
        .expect(201)
        .expect('content-type', /application\/json/);

      expect(res.body).toBeDefined();
      expect(await Invoice.countDocuments({})).toBe(1);
    });

    // TODO: this one here - move the objectId regex to a types file?
    test('creating a valid invoice returns object with expected types and values: 201', async () => {
      const expected = {
        ...invoice,
        customer,
        date: invoice.date.toISOString(),
        items: invoice.items.map((item) => ({
          ...item,
          total: item.quantity * item.amount,
          id: expect.stringMatching(/^[0-9a-f]{24}$/),
        })),
        total: invoice.items.reduce(
          (total, current) => total + current.quantity * current.amount,
          0
        ),
        invoiceNumber: expect.any(Number),
        due: dayjs(invoice.date)
          .add(invoice.paymentTerms, 'days')
          .toISOString(),
        id: expect.stringMatching(/^[0-9a-f]{24}$/),
      };

      const res = await api
        .post('/api/invoices')
        .send(invoice)
        .expect(201)
        .expect('content-type', /application\/json/);

      expect(res.body).toEqual(expected);
      expect(await Invoice.countDocuments({})).toBe(1);
    });

    test('creating invoices generates a sequential invoice number', async () => {
      const res_1 = await api.post('/api/invoices').send(invoice);
      const res_2 = await api.post('/api/invoices').send(invoice);

      const nextNumber = res_1.body.invoiceNumber + 1;
      expect(res_2.body).toEqual(
        expect.objectContaining({ invoiceNumber: nextNumber })
      );
    });

    describe('date field is validated: 400', () => {
      test('missing => invalid_type', async () => {
        const res = await api
          .post('/api/invoices')
          .send(omit(invoice, 'date'))
          .expect(400)
          .expect('content-type', /application\/json/);

        expect(await Invoice.countDocuments({})).toBe(0);
        expect(res.body.error.issues).toEqual([
          expect.objectContaining({ code: 'invalid_type' }),
        ]);
      });

      test('wrong type => invalid_type', async () => {
        const res = await api
          .post('/api/invoices')
          .send({
            ...invoice,
            date: true,
          })
          .expect(400)
          .expect('content-type', /application\/json/);

        expect(await Invoice.countDocuments({})).toBe(0);
        expect(res.body.error.issues).toEqual([
          expect.objectContaining({ code: 'invalid_type' }),
        ]);
      });

      test('wrong format => invalid_date', async () => {
        const res = await api
          .post('/api/invoices')
          .send({
            ...invoice,
            date: '13-32-2023',
          })
          .expect(400)
          .expect('content-type', /application\/json/);

        expect(await Invoice.countDocuments({})).toBe(0);
        expect(res.body.error.issues).toEqual([
          expect.objectContaining({ code: 'invalid_date' }),
        ]);
      });
    });

    describe('paymentTerms field is validated: 400', () => {
      test('missing => invalid_type', async () => {
        const res = await api
          .post('/api/invoices')
          .send(omit(invoice, 'paymentTerms'))
          .expect(400)
          .expect('content-type', /application\/json/);

        expect(await Invoice.countDocuments({})).toBe(0);
        expect(res.body.error.issues).toEqual([
          expect.objectContaining({ code: 'invalid_type' }),
        ]);
      });

      test('wrong type => invalid_type', async () => {
        const res = await api
          .post('/api/invoices')
          .send({ ...invoice, paymentTerms: true })
          .expect(400)
          .expect('content-type', /application\/json/);

        expect(await Invoice.countDocuments({})).toBe(0);
        expect(res.body.error.issues).toEqual([
          expect.objectContaining({ code: 'invalid_type' }),
        ]);
      });

      test('float => invalid_type', async () => {
        const res = await api
          .post('/api/invoices')
          .send({ ...invoice, paymentTerms: 1.1 })
          .expect(400)
          .expect('content-type', /application\/json/);

        expect(await Invoice.countDocuments({})).toBe(0);
        expect(res.body.error.issues).toEqual([
          expect.objectContaining({ code: 'invalid_type' }),
        ]);
      });

      test('negative number => too_small', async () => {
        const res = await api
          .post('/api/invoices')
          .send({ ...invoice, paymentTerms: -1 })
          .expect(400)
          .expect('content-type', /application\/json/);

        expect(await Invoice.countDocuments({})).toBe(0);
        expect(res.body.error.issues).toEqual([
          expect.objectContaining({ code: 'too_small' }),
        ]);
      });

      test('zero => too_small', async () => {
        const res = await api
          .post('/api/invoices')
          .send({ ...invoice, paymentTerms: 0 })
          .expect(400)
          .expect('content-type', /application\/json/);

        expect(await Invoice.countDocuments({})).toBe(0);
        expect(res.body.error.issues).toEqual([
          expect.objectContaining({ code: 'too_small' }),
        ]);
      });
    });

    describe('status field is validated: 400', () => {
      test('missing => invalid_type', async () => {
        const res = await api
          .post('/api/invoices')
          .send(omit(invoice, 'status'))
          .expect(400)
          .expect('content-type', /application\/json/);

        expect(await Invoice.countDocuments({})).toBe(0);
        expect(res.body.error.issues).toEqual([
          expect.objectContaining({ code: 'invalid_type' }),
        ]);
      });

      test('wrong type => invalid_type', async () => {
        const res = await api
          .post('/api/invoices')
          .send({
            ...invoice,
            status: true,
          })
          .expect(400)
          .expect('content-type', /application\/json/);

        expect(await Invoice.countDocuments({})).toBe(0);
        expect(res.body.error.issues).toEqual([
          expect.objectContaining({ code: 'invalid_type' }),
        ]);
      });

      test('invalid enum => invalid_enum_value', async () => {
        const res = await api
          .post('/api/invoices')
          .send({
            ...invoice,
            status: 'invalid enum',
          })
          .expect(400)
          .expect('content-type', /application\/json/);

        expect(await Invoice.countDocuments({})).toBe(0);
        expect(res.body.error.issues).toEqual([
          expect.objectContaining({ code: 'invalid_enum_value' }),
        ]);
      });
    });

    describe('customer field is validated: 400', () => {
      test('missing => invalid_type', async () => {
        const res = await api
          .post('/api/invoices')
          .send(omit(invoice, 'customer'))
          .expect(400)
          .expect('content-type', /application\/json/);

        expect(await Invoice.countDocuments({})).toBe(0);
        expect(res.body.error.issues).toEqual([
          expect.objectContaining({ code: 'invalid_type' }),
        ]);
      });

      test('wrong type => invalid_type', async () => {
        const res = await api
          .post('/api/invoices')
          .send({
            ...invoice,
            customer: true,
          })
          .expect(400)
          .expect('content-type', /application\/json/);

        expect(await Invoice.countDocuments({})).toBe(0);
        expect(res.body.error.issues).toEqual([
          expect.objectContaining({ code: 'invalid_type' }),
        ]);
      });

      test('malformatted ID => invalid_string', async () => {
        const res = await api
          .post('/api/invoices')
          .send({
            ...invoice,
            customer: 'abcdef123',
          })
          .expect(400)
          .expect('content-type', /application\/json/);

        expect(await Invoice.countDocuments({})).toBe(0);
        expect(res.body.error.issues).toEqual([
          expect.objectContaining({ code: 'invalid_string' }),
        ]);
      });
    });

    describe('items field is validated: 400', () => {
      test('missing => invalid_type', async () => {
        const res = await api
          .post('/api/invoices')
          .send(omit(invoice, 'items'))
          .expect(400)
          .expect('content-type', /application\/json/);

        expect(await Invoice.countDocuments({})).toBe(0);
        expect(res.body.error.issues).toEqual([
          expect.objectContaining({ code: 'invalid_type' }),
        ]);
      });

      test('empty array => too_small', async () => {
        const res = await api
          .post('/api/invoices')
          .send({
            ...invoice,
            items: [],
          })
          .expect(400)
          .expect('content-type', /application\/json/);

        expect(await Invoice.countDocuments({})).toBe(0);
        expect(res.body.error.issues).toEqual([
          expect.objectContaining({ code: 'too_small' }),
        ]);
      });

      test('wrong type => invalid_type', async () => {
        const res = await api
          .post('/api/invoices')
          .send({
            ...invoice,
            items: [{ item: '1' }, { item: '2' }],
          })
          .expect(400)
          .expect('content-type', /application\/json/);

        expect(await Invoice.countDocuments({})).toBe(0);
        expect(res.body.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ code: 'invalid_type' }),
          ])
        );
      });

      // TODO: put this in a different file ?
      describe('quantity field is validated: 400', () => {
        test('missing => invalid_type', async () => {
          const res = await api
            .post('/api/invoices')
            .send({
              ...invoice,
              items: [omit(invoice.items[0], 'quantity')],
            })
            .expect(400)
            .expect('content-type', /application\/json/);

          expect(res.body.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ code: 'invalid_type' }),
            ])
          );
        });

        test('wrong type => invalid_type', async () => {
          const res = await api
            .post('/api/invoices')
            .send({
              ...invoice,
              items: [{ ...invoice.items[0], quantity: true }],
            })
            .expect(400)
            .expect('content-type', /application\/json/);

          expect(res.body.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ code: 'invalid_type' }),
            ])
          );
        });

        test('float => invalid_type', async () => {
          const res = await api
            .post('/api/invoices')
            .send({
              ...invoice,
              items: [{ ...invoice.items[0], quantity: 1.1 }],
            })
            .expect(400)
            .expect('content-type', /application\/json/);

          expect(res.body.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ code: 'invalid_type' }),
            ])
          );
        });

        test('negative number => too_small', async () => {
          const res = await api
            .post('/api/invoices')
            .send({
              ...invoice,
              items: [{ ...invoice.items[0], quantity: -1 }],
            })
            .expect(400)
            .expect('content-type', /application\/json/);

          expect(res.body.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ code: 'too_small' }),
            ])
          );
        });

        test('zero => too_small', async () => {
          const res = await api
            .post('/api/invoices')
            .send({
              ...invoice,
              items: [{ ...invoice.items[0], quantity: -1 }],
            })
            .expect(400)
            .expect('content-type', /application\/json/);

          expect(res.body.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ code: 'too_small' }),
            ])
          );
        });
      });

      // TODO: put this in a different file?
      describe('description field is validated: 400', () => {
        test('missing => invalid_type', async () => {
          const res = await api
            .post('/api/invoices')
            .send({
              ...invoice,
              items: [omit(invoice.items[0], 'description')],
            })
            .expect(400)
            .expect('content-type', /application\/json/);

          expect(res.body.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ code: 'invalid_type' }),
            ])
          );
        });

        test('wrong type => invalid_type', async () => {
          const res = await api
            .post('/api/invoices')
            .send({
              ...invoice,
              items: [{ ...invoice.items[0], description: true }],
            })
            .expect(400)
            .expect('content-type', /application\/json/);

          expect(res.body.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ code: 'invalid_type' }),
            ])
          );
        });
      });

      // TODO: put this in separate file?
      describe('amount field is validated: 400', () => {
        test('missing => invalid_type', async () => {
          const res = await api
            .post('/api/invoices')
            .send({ ...invoice, items: [omit(invoice.items[0], 'amount')] })
            .expect(400)
            .expect('content-type', /application\/json/);

          expect(res.body.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ code: 'invalid_type' }),
            ])
          );
        });

        test('wrong type => invalid_type', async () => {
          const res = await api
            .post('/api/invoices')
            .send({
              ...invoice,
              items: [{ ...invoice.items[0], amount: true }],
            })
            .expect(400)
            .expect('content-type', /application\/json/);

          expect(res.body.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ code: 'invalid_type' }),
            ])
          );
        });

        test('negative number => too_small', async () => {
          const res = await api
            .post('/api/invoices')
            .send({
              ...invoice,
              items: [{ ...invoice.items[0], amount: -1.1 }],
            })
            .expect(400)
            .expect('content-type', /application\/json/);

          expect(res.body.error.issues).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ code: 'too_small' }),
            ])
          );
        });
      });
    });
  });

  describe('DELETE /api/invoices/:id', () => {
    let invoiceId: string;

    beforeEach(async () => {
      const { id } = await Customer.create(customer);
      customer.id = id;
      invoice.customer = id;

      const createdInvoice = await Invoice.create(invoice);
      await createdInvoice.populate('customer');

      invoiceId = createdInvoice.id;
    });

    test('an invoice can be deleted by id: 204', async () => {
      await api.delete(`/api/invoices/${invoiceId}`).expect(204);
      expect(await Invoice.findById(invoiceId)).toBe(null);
    });

    // TODO: make this test work properly
    test('deleting latest invoice decrements invoice number sequence to free the number', async () => {
      const latestInvoice = await Invoice.findById(invoiceId);
      const latestNumber = latestInvoice?.invoiceNumber;

      await api.delete(`/api/invoices/${invoiceId}`).expect(204);

      const newInvoice = await api
        .post('/api/invoices')
        .send(invoice)
        .expect(201);

      expect(newInvoice.body.invoiceNumber).toEqual(latestNumber);
    });

    // TODO: should I put specific error messages in for these? (handle in controller or pass to errorHandler?)
    test('deleting an already-deleted invoice returns: 404', async () => {
      await Invoice.deleteMany({});
      await api.delete(`/api/invoices/${invoiceId}`).expect(404);
      expect(await Invoice.findById(invoiceId)).toBe(null);
    });

    test('deleting a non-existing invoice returns: 404', async () => {
      await api.delete('/api/invoices/1234567890abcdef12345678').expect(404);
    });

    test('passing an invalid id request parameter returns: 400', async () => {
      // TODO: should this not have a specific error message? (where are these errors coming from)
      await api.delete('/api/invoices/1234567890invalid').expect(400);
    });
  });

  describe('PUT /api/invoices/:id', () => {
    let invoiceId: string;

    beforeAll(async () => {
      await Invoice.deleteMany({});
      const { id } = await Customer.create(customer);
      customer.id = id;
      invoice.customer = id;

      const createdInvoice = await Invoice.create(invoice);
      await createdInvoice.populate('customer');

      invoiceId = createdInvoice.id;
    });

    // TODO: check in route - currently validating by a schema.deepPartial() but it's deprecated
    // make a new Edit schema instead
    test('an invoice can be edited by id: 200', async () => {
      const edited = {
        ...invoice,
        id: invoiceId,
        status: 'paid',
        items: [
          { quantity: 1, description: 'edited 1', amount: 10 },
          { quantity: 2, description: 'edited 2', amount: 20 },
          { quantity: 3, description: 'edited 3', amount: 30 },
        ],
      };
      const res = await api
        .put(`/api/invoices/${invoiceId}`)
        .send(edited)
        .expect(200);

      expect(res.body).toMatchObject(JSON.parse(JSON.stringify(edited)));
    });

    test('editing a non-existing invoice returns: 404', async () => {
      const edited = {
        ...invoice,
        status: 'paid',
      };
      await api
        .put(`/api/invoices/abcdef0123456789abcdefab`)
        .send(edited)
        .expect(404);
    });

    test('editing a malformatted id returns: 400', async () => {
      const edited = {
        ...invoice,
        status: 'paid',
      };
      await api
        .put('/api/invoices/zxcv123abcdef1234567890')
        .send(edited)
        .expect(400);
    });
  });
});
// test for using an invorrect http verb: e.g. DELETE /api/invoices

