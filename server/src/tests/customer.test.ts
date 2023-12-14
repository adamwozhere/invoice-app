/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { test, describe, beforeAll, afterAll, expect } from 'vitest';
import supertest from 'supertest';

import db from '../utils/db';
import app from '../app';
import Customer from '../models/customer.model';
import { getFirstCustomer } from '../utils/testing';

const api = supertest(app);

let customerId: string | undefined;

beforeAll(async () => {
  await db.testServer.start();
});

afterAll(async () => {
  await db.testServer.stop();
});

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
      .send({
        name: 'John Doe',
        email: 'john@doe.com',
        address: {
          line1: '123 Park St.',
          city: 'London',
          postcode: 'LN101SU',
        },
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);
    expect(customer.body.name).toBe('John Doe');
  });
});

describe('when customer db contains entries', () => {
  beforeAll(async () => {
    const customer = new Customer({
      name: 'Jane Doe',
      email: 'jane@doe.com',
      address: {
        line1: '123 Park St.',
        city: 'London',
        postcode: 'LN101SU',
      },
    });
    await customer.save();
  });

  test('fetching customers returns all entries with 200', async () => {
    const res = await api.get('/api/customers').expect(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].name).toBe('John Doe');
    expect(res.body[1].name).toBe('Jane Doe');
  });

  test('a customer can be fetched by ID with 200', async () => {
    const targetCustomer = await getFirstCustomer();
    const customer = await api
      .get(`/api/customers/${targetCustomer?.id}`)
      .expect(200);
    expect(customer.body.name).toBe('John Doe');
    expect(customer.body.id).toBe(targetCustomer?.id);
  });

  test('a customer can be deleted with 204', async () => {
    const targetCustomer = await getFirstCustomer();
    // TODO: fix this bit ._id
    // Should I be setting the type of the returned object in the service to be my Interface object?
    // (at the moment the returned type is the inferred model)
    // NOTE: I'm not exporting the Interface types yet, only the models!

    customerId = targetCustomer?.id;

    await api.delete(`/api/customers/${targetCustomer?.id}`).expect(204);
    const res = await api.get('/api/customers').expect(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).not.toBe('John Doe');
  });

  test('fetching a deleted customer returns 404', async () => {
    await api.get(`/api/customers/${customerId}`).expect(404);
  });
});

