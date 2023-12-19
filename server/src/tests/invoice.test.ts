/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { test, describe, beforeAll, afterAll, expect } from 'vitest';
import { omit } from 'lodash';
import supertest from 'supertest';

import db from '../utils/db';
import app from '../app';
import Customer from '../models/customer.model';

const api = supertest(app);

// TODO: do I just check that a returned id is present for items and invoices?
// then just compare to input object but with ommited id's and a populated customer?

/**
 * SETUP TESTS
 */
const customer = {
  name: 'Sherlock Holmes',
  email: 'sherlock@baker-st.com',
  address: {
    line1: '221B Baker St',
    line2: 'Marylebone',
    city: 'London',
    postcode: 'NW1 6XE',
  },
  id: null,
};

const invoiceInput = [
  {
    date: new Date('12-12-2023'),
    paymentTerms: 28,
    status: 'pending',
    customer: null,
    items: [
      {
        quantity: 1,
        description: 'item 1',
        amount: 9.99,
        total: null,
        id: null,
      },
      {
        quantity: 10,
        description: 'item 2',
        amount: 0.99,
        total: null,
        id: null,
      },
    ],
    id: null,
    total: null,
    due: null,
  },
  {
    date: new Date('12-12-2023'),
    paymentTerms: 31,
    status: 'draft',
    customer: null,
    items: [
      {
        quantity: 5,
        description: 'item 1',
        amount: 299,
        total: null,
        id: null,
      },
    ],
    id: null,
    total: null,
    due: null,
  },
];

const invoiceOutput = [
  {
    ...invoiceInput[0],
    date: '2023-12-12T00:00:00.000Z',
    due: '2024-01-09T00:00:00.000Z',
    items: [
      { ...invoiceInput[0]!.items[0], total: 9.99 },
      { ...invoiceInput[0]!.items[1], total: 9.9 },
    ],
    customer: {},
    total: 19.89,
  },
  {
    ...invoiceInput[1],
    date: '2023-12-12T00:00:00.000Z',
    due: '2024-01-12T00:00:00.000Z',
    items: [{ ...invoiceInput[1]!.items[0], total: 1495 }],
    customer: {},
    total: 1495,
  },
];

beforeAll(async () => {
  await db.testServer.start();
  // create test customer to attach to invoices
  const res = new Customer(customer);
  await res.save();

  // add returned customer id to invoices and customer
  customer.id = res.id;
  invoiceInput.forEach((inv) => (inv.customer = res.id));
  invoiceOutput.forEach((inv) => (inv.customer = customer));
});

afterAll(async () => {
  await db.testServer.stop();
});

/**
 * BEGIN TESTS
 */
describe('when invoice db is empty', () => {
  test('fetching invoices returns an empty array', async () => {
    const res = await api
      .get('/api/invoices')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(res.body).toStrictEqual([]);
  });

  test('adding an invoice returns 201', async () => {
    const res = await api
      .post('/api/invoices')
      .send(invoiceInput[0])
      .expect(201)
      .expect('Content-Type', /application\/json/);

    // add returned invoice id to output
    invoiceOutput[0]!.id = res.body.id;
    // add returned item id's to output
    invoiceOutput[0]?.items.forEach(
      (item, i) => (item.id = res.body.items[i].id)
    );
    expect(res.body).toEqual(invoiceOutput[0]);
  });
});

describe('creating a valid invoice', () => {
  test('virtual properties are returned with correct values', async () => {
    const res = await api
      .post('/api/invoices')
      .send(invoiceInput[1])
      .expect(201);

    // add returned invoice id to output
    invoiceOutput[1]!.id = res.body.id;
    // add returned item id's to output
    invoiceOutput[1]?.items.forEach(
      (item, i) => (item.id = res.body.items[i].id)
    );
    expect(res.body).toEqual(invoiceOutput[1]);
  });
});

describe('creating an invoice with missing or wrong types returns appropriate error response', () => {
  describe('date', () => {
    test('missing => invalid_type', async () => {
      const res = await api
        .post('/api/invoices')
        .send(omit(invoiceInput[0], 'date'))
        .expect(400);

      const errorCodes = res.body.error.issues.map(
        (i: { code: string }) => i.code
      );
      expect(errorCodes).toContain('invalid_type');
    });

    test('wrong type => invalid_type', async () => {
      const res = await api
        .post('/api/invoices')
        .send({
          ...invoiceInput[0],
          date: undefined,
        })
        .expect(400);

      const errorCodes = res.body.error.issues.map(
        (i: { code: string }) => i.code
      );
      expect(errorCodes).toContain('invalid_type');
    });

    test('wrong date format => invalid_date', async () => {
      const res = await api
        .post('/api/invoices')
        .send({
          ...invoiceInput[0],
          date: '13-32-2023',
        })
        .expect(400);

      const errorCodes = res.body.error.issues.map(
        (i: { code: string }) => i.code
      );
      expect(errorCodes).toContain('invalid_date');
    });
  });

  describe('paymentTerms', () => {
    test('missing => invalid_type', async () => {
      const res = await api
        .post('/api/invoices')
        .send(omit(invoiceInput[0], 'paymentTerms'))
        .expect(400);

      const errorCodes = res.body.error.issues.map(
        (i: { code: string }) => i.code
      );
      expect(errorCodes).toContain('invalid_type');
    });

    test('wrong type => invalid_type', async () => {
      const res = await api
        .post('/api/invoices')
        .send({
          ...invoiceInput[0],
          paymentTerms: 'ten days',
        })
        .expect(400);

      const errorCodes = res.body.error.issues.map(
        (i: { code: string }) => i.code
      );
      expect(errorCodes).toContain('invalid_type');
    });

    test('not integer => invalid_type', async () => {
      const res = await api
        .post('/api/invoices')
        .send({
          ...invoiceInput[0],
          paymentTerms: 0.125,
        })
        .expect(400);

      const errorCodes = res.body.error.issues.map(
        (i: { code: string }) => i.code
      );
      expect(errorCodes).toContain('invalid_type');
    });

    test('negative value => too_small', async () => {
      const res = await api
        .post('/api/invoices')
        .send({
          ...invoiceInput[0],
          paymentTerms: -10,
        })
        .expect(400);

      const errorCodes = res.body.error.issues.map(
        (i: { code: string }) => i.code
      );
      expect(errorCodes).toContain('too_small');
    });
  });

  describe('status', () => {
    test('missing => invalid_type', async () => {
      const res = await api
        .post('/api/invoices')
        .send(omit(invoiceInput[0], 'status'))
        .expect(400);

      const errorCodes = res.body.error.issues.map(
        (i: { code: string }) => i.code
      );
      expect(errorCodes).toContain('invalid_type');
    });

    test('wrong type => invalid_type', async () => {
      const res = await api
        .post('/api/invoices')
        .send({
          ...invoiceInput[0],
          status: 1,
        })
        .expect(400);

      const errorCodes = res.body.error.issues.map(
        (i: { code: string }) => i.code
      );
      expect(errorCodes).toContain('invalid_type');
    });

    test('wrong enum value => invalid_enum_value', async () => {
      const res = await api
        .post('/api/invoices')
        .send({
          ...invoiceInput[0],
          status: 'incorrect',
        })
        .expect(400);

      const errorCodes = res.body.error.issues.map(
        (i: { code: string }) => i.code
      );
      expect(errorCodes).toContain('invalid_enum_value');
    });
  });
});

