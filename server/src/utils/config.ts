import dotenv from 'dotenv';
import logger from './logger';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI === undefined) {
  logger.error('Environment var not defined: MONGODB_URI');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const FRONTEND_PATH = '../client/dist';

// TODO: check all env vars are present in loop (need to work out as process.env is not typed?)
// can use dotenv.populate(process.env parsed)?

export default {
  MONGODB_URI,
  PORT,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  FRONTEND_PATH,
};

