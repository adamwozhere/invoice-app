/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { test, describe, beforeAll, afterAll, expect } from 'vitest';
import supertest from 'supertest';

import db from '../utils/db';
import app from '../app';
import Customer from '../models/customer.model';

const api = supertest(app);

/**
 * SETUP TESTS
 */
const customerInput = [
  {
    name: 'Sherlock Holmes',
    email: 'sherlock@baker-st.com',
    address: {
      line1: '221B Baker St',
      line2: 'Marylebone',
      city: 'London',
      postcode: 'NW1 6XE',
    },
    id: null,
  },
  {
    name: 'John Watson',
    email: 'john@baker-st.com',
    address: {
      line1: '221B Baker St',
      line2: 'Marylebone',
      city: 'London',
      postcode: 'NW1 6XE',
    },
    id: null,
  },
];

beforeAll(async () => {
  await db.testServer.start();
});

afterAll(async () => {
  await db.testServer.stop();
});

/**
 * START TESTS
 */
describe('when customer db is empty', () => {
  test('fetching customers returns 404', async () => {
    await api
      .get('/api/customers')
      .expect(404)
      .expect('Content-Type', /application\/json/);
  });

  test('adding a customer returns 201', async () => {
    const customer = await api
      .post('/api/customers')
      .send(customerInput[0])
      .expect(201)
      .expect('Content-Type', /application\/json/);
    // update customer input object with returned id
    customerInput[0]!.id = customer.body.id;
    expect(customer.body).toEqual(customerInput[0]);
  });
});

describe('when customer db contains entries', () => {
  beforeAll(async () => {
    const customer = new Customer(customerInput[1]);
    await customer.save();
    // update cusomer object with returned id
    customerInput[1]!.id = customer.id;
  });

  test('fetching customers returns all entries with 200', async () => {
    const res = await api.get('/api/customers').expect(200);
    expect(res.body).toHaveLength(2);
    expect(res.body).toEqual(customerInput);
    expect(res.body[0].name).toBe('Sherlock Holmes');
    expect(res.body[1].name).toBe('John Watson');
  });

  test('a customer can be fetched by ID with 200', async () => {
    const res = await api
      .get(`/api/customers/${customerInput[0]?.id}`)
      .expect(200);
    expect(res.body).toEqual(customerInput[0]);
  });

  test('a customer can be deleted with 204', async () => {
    await api.delete(`/api/customers/${customerInput[0]?.id}`).expect(204);
    const res = await api.get('/api/customers').expect(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).not.toEqual(customerInput[0]);
  });

  test('fetching a deleted customer returns 404', async () => {
    await api.get(`/api/customers/${customerInput[0]?.id}`).expect(404);
  });
});

