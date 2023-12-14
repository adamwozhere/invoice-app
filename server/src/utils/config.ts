import dotenv from 'dotenv';
import logger from './logger';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI === undefined) {
  logger.error('Environment var not defined: MONGODB_URI');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

const FRONTEND = '../client/dist';

export default {
  MONGODB_URI,
  PORT,
  FRONTEND,
};

