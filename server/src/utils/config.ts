import dotenv from 'dotenv';
dotenv.config();

if (process.env.MONGODB_URI === undefined) {
  throw Error('Environment var not defined: MONGODB_URI');
}

if (process.env.TEST_MONGODB_URI === undefined) {
  throw Error('Environment var not defined: TEST_MONGODB_URI');
}

const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const PORT = process.env.PORT || 3000;

const FRONTEND = '../client/dist';

export default {
  MONGODB_URI,
  PORT,
  FRONTEND,
};

