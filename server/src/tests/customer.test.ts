/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  test,
  describe,
  beforeAll,
  beforeEach,
  afterAll,
  expect,
} from 'vitest';
import supertest from 'supertest';

import db from '../utils/db';
import app from '../app';
import Customer from '../models/customer.model';
import { omit } from 'lodash';

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
    id: '',
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
    id: '',
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

describe('GET /api/customers', () => {
  test('empty database returns an empty array: 200', async () => {
    const res = await api
      .get('/api/customers')
      .expect(200)
      .expect('content-type', /application\/json/);

    expect(res.body).toStrictEqual([]);
  });

  test('database with entries returns all customers: 200', async () => {
    const customers = await Customer.create(customerInput);

    const expected = JSON.parse(JSON.stringify(customers));
    const res = await api
      .get('/api/customers')
      .expect(200)
      .expect('content-type', /application\/json/);

    expect(res.body).toEqual(expected);
    expect(res.body).toHaveLength(customerInput.length);
  });
});

describe('GET /api/customers/:id', () => {
  let customerId: string;

  beforeAll(async () => {
    await Customer.deleteMany({});
    const { id } = await Customer.create(customerInput[0]);
    customerId = id;
  });

  test('a customer can be fetched by id: 200', async () => {
    const res = await api
      .get(`/api/customers/${customerId}`)
      .expect(200)
      .expect('content-type', /application\/json/);

    expect(res.body).toBeDefined();
  });

  test('fetched customer returns expected fields and types', async () => {
    const expected = {
      ...customerInput[0],
      id: customerId,
    };

    console.log(expected);

    const res = await api
      .get(`/api/customers/${customerId}`)
      .expect(200)
      .expect('content-type', /application\/json/);

    console.log(res.body);

    expect(res.body).toEqual(expected);
  });

  // TODO: check for uppercasing of and trimming of postcode field?
  test('fetching a customer with malformatted id errors => invalid_string: 400', async () => {
    const res = await api
      .get('/api/customers/malformattedId')
      .expect(400)
      .expect('content-type', /application\/json/);

    expect(res.body.error.issues).toEqual([
      expect.objectContaining({ code: 'invalid_string' }),
    ]);
  });

  test('fetching a customer with an incorrect id erors: 404', async () => {
    await api.get('/api/customers/abcdef0123456789abcdef00').expect(404);
  });
});

describe('POST /api/customers', () => {
  beforeEach(async () => {
    await Customer.deleteMany({});
    console.log('beforeEach');
  });

  test('creating a valid customer adds it to the database: 201', async () => {
    const res = await api
      .post('/api/customers')
      .send(customerInput[0])
      .expect(201)
      .expect('content-type', /application\/json/);

    expect(res.body).toBeDefined();
    expect(await Customer.countDocuments({})).toBe(1);
  });

  test('creating a valid customer returns object with expected types and values: 201', async () => {
    // TODO: not sure if this is needed in this way?
    // as there are no nested things that need converting like Date object, or nested id's to deal with,
    // could just make this test a 'returns expected object' type test. (may need to implement postcode formatting)
    const expected = {
      ...customerInput[0],
      id: expect.stringMatching(/^[0-9a-f]{24}$/),
    };

    const res = await api
      .post('/api/customers')
      .send(customerInput[0])
      .expect(201)
      .expect('content-type', /application\/json/);

    expect(res.body).toEqual(expected);
  });

  // TODO: tests for postcode return formatted correctly

  describe('name field is validated: 400', () => {
    test('missing => invalid_type', async () => {
      const res = await api
        .post('/api/customers')
        .send(omit(customerInput[0], 'name'))
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'invalid_type' }),
      ]);
    });

    test('wrong type => invalid_type', async () => {
      const res = await api
        .post('/api/customers')
        .send({
          ...customerInput[0],
          name: true,
        })
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'invalid_type' }),
      ]);
    });

    // TODO: test to include trimmed strings?
    test('empty string => too_small', async () => {
      const res = await api
        .post('/api/customers')
        .send({
          ...customerInput[0],
          name: '',
        })
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'too_small' }),
      ]);
    });

    test('string > 35 chars => too_big', async () => {
      const res = await api
        .post('/api/customers')
        .send({
          ...customerInput[0],
          name: 'qwertyuiop asdfghjklzxcvbnmqwertyuio',
        })
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'too_big' }),
      ]);
    });
  });

  describe('email is validated: 400', () => {
    test('missing => invalid_type', async () => {
      const res = await api
        .post('/api/customers')
        .send(omit(customerInput[0], 'email'))
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'invalid_type' }),
      ]);
    });

    test('wrong type => invalid_type', async () => {
      const res = await api
        .post('/api/customers')
        .send({
          ...customerInput[0],
          email: true,
        })
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'invalid_type' }),
      ]);
    });

    test('malformatted => invalid_string', async () => {
      const res = await api
        .post('/api/customers')
        .send({
          ...customerInput[0],
          email: 'email@address@com',
        })
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'invalid_string' }),
      ]);
    });
  });

  describe('address fields are validated: 400', () => {
    test('missing => invalid_type', async () => {
      const res = await api
        .post('/api/customers')
        .send(omit(customerInput[0], 'address'))
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'invalid_type' }),
      ]);
    });

    test('wrong type => invalid_type', async () => {
      const res = await api
        .post('/api/customers')
        .send({
          ...customerInput[0],
          address: true,
        })
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'invalid_type' }),
      ]);
    });
  });

  describe('line1 is validated: 400', () => {
    test('missing => invalid_type', async () => {
      const res = await api
        .post('/api/customers')
        .send({
          ...customerInput[0],
          address: omit(customerInput[0]?.address, 'line1'),
        })
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'invalid_type' }),
      ]);
    });

    test('wrong type => invalid_type', async () => {
      const res = await api
        .post('/api/customers')
        .send({
          ...customerInput[0],
          address: {
            ...customerInput[0]!.address,
            line1: true,
          },
        })
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'invalid_type' }),
      ]);
    });

    test('empty string => too_small', async () => {
      const res = await api
        .post('/api/customers')
        .send({
          ...customerInput[0],
          address: {
            ...customerInput[0]!.address,
            line1: '',
          },
        })
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'too_small' }),
      ]);
    });
  });

  describe('line2 is validated: 400', () => {
    test('wrong type => invalid_type', async () => {
      const res = await api
        .post('/api/customers')
        .send({
          ...customerInput[0],
          address: {
            ...customerInput[0]!.address,
            line2: true,
          },
        })
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'invalid_type' }),
      ]);
    });

    test('empty string => too_small', async () => {
      const res = await api
        .post('/api/customers')
        .send({
          ...customerInput[0],
          address: {
            ...customerInput[0]!.address,
            line2: '',
          },
        })
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'too_small' }),
      ]);
    });
  });

  describe('city is validated: 400', () => {
    test('missing => invalid_type', async () => {
      const res = await api
        .post('/api/customers')
        .send({
          ...customerInput[0],
          address: omit(customerInput[0]!.address, 'city'),
        })
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'invalid_type' }),
      ]);
    });

    test('wrong type => invalid_type', async () => {
      const res = await api
        .post('/api/customers')
        .send({
          ...customerInput[0],
          address: {
            ...customerInput[0]!.address,
            city: true,
          },
        })
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'invalid_type' }),
      ]);
    });

    test('empty string => too_small', async () => {
      const res = await api
        .post('/api/customers')
        .send({
          ...customerInput[0],
          address: {
            ...customerInput[0]!.address,
            city: '',
          },
        })
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'too_small' }),
      ]);
    });
  });

  describe('county is validated: 400', () => {
    test('wrong type => invalid_type', async () => {
      const res = await api
        .post('/api/customers')
        .send({
          ...customerInput[0],
          address: {
            ...customerInput[0]!.address,
            county: true,
          },
        })
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'invalid_type' }),
      ]);
    });

    test('empty string => too_small', async () => {
      const res = await api
        .post('/api/customers')
        .send({
          ...customerInput[0],
          address: {
            ...customerInput[0]!.address,
            county: '',
          },
        })
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'too_small' }),
      ]);
    });
  });

  describe('postcode is validated: 400', () => {
    test('missing => invalid_type', async () => {
      const res = await api
        .post('/api/customers')
        .send({
          ...customerInput[0],
          address: omit(customerInput[0]!.address, 'postcode'),
        })
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'invalid_type' }),
      ]);
    });

    test('wrong type => invalid_type', async () => {
      const res = await api
        .post('/api/customers')
        .send({
          ...customerInput[0],
          address: {
            ...customerInput[0]!.address,
            postcode: true,
          },
        })
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'invalid_type' }),
      ]);
    });

    test('empty string => invalid_string', async () => {
      const res = await api
        .post('/api/customers')
        .send({
          ...customerInput[0],
          address: {
            ...customerInput[0]!.address,
            postcode: '',
          },
        })
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'invalid_string' }),
      ]);
    });

    test('malformatted string => invalid_string', async () => {
      const res = await api
        .post('/api/customers')
        .send({
          ...customerInput[0],
          address: {
            ...customerInput[0]!.address,
            postcode: 'B2BBCY3',
          },
        })
        .expect(400)
        .expect('content-type', /application\/json/);

      expect(await Customer.countDocuments({})).toBe(0);
      expect(res.body.error.issues).toEqual([
        expect.objectContaining({ code: 'invalid_string' }),
      ]);
    });
  });
});

describe('DELETE /api/customers/:id', () => {
  let customerId: string;

  beforeAll(async () => {
    const { id } = await Customer.create(customerInput[0]);
    customerId = id;
  });

  test('a customer can be deleted by id: 204', async () => {
    await api.delete(`/api/customers/${customerId}`).expect(204);
    expect(await Customer.findById(customerId)).toBe(null);
  });

  test('deleting an already-deleted customer returns: 404', async () => {
    await api.delete(`/api/customers/${customerId}`).expect(404);
    expect(await Customer.findById(customerId)).toBe(null);
  });

  test('deleting a non-existing customer returns: 404', async () => {
    await api.delete('/api/customers/1234567890abcdef12345678').expect(404);
  });

  test('passing an invalid id request parameter returns: 400', async () => {
    await api.delete('/api/customers/1234567890invalid').expect(400);
  });
});

describe('PUT /api/customers/:id', () => {
  let customerId: string;

  beforeAll(async () => {
    await Customer.deleteMany({});
    const { id } = await Customer.create(customerInput[0]);
    customerId = id;
  });

  test('a customer can be edited by id: 200', async () => {
    const edited = {
      ...customerInput[0],
      email: 'sherlock@investigator.com',
      address: {
        ...customerInput[0]!.address,
        line2: 'Hammersmith',
      },
      id: customerId,
    };
    const res = await api
      .put(`/api/customers/${customerId}`)
      .send(edited)
      .expect(200)
      .expect('content-type', /application\/json/);

    expect(res.body).toMatchObject(JSON.parse(JSON.stringify(edited)));
  });
});

