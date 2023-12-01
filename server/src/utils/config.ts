import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';
const PORT = process.env.PORT || '';
const FRONTEND = '../client/dist';

export default {
  MONGODB_URI,
  PORT,
  FRONTEND,
};

