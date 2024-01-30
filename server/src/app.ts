import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import config from './utils/config';
import logger from './utils/logger';
import db from './utils/db';

import invoiceRouter from './routes/invoice.route';
import customerRouter from './routes/customer.route';
import userRouter from './routes/user.route';
// import loginRouter from './routes/login.route';
import authRouter from './routes/auth.route';

import requestLogger from './middleware/requestLogger';
import errorHandler from './middleware/errorHandler';

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);

// TODO: cors ?
// TODO: do I need this anymore?
// mongoose.set('strictQuery', false);

void db.connect();

// healthcheck
app.get('/ping', (_, res) => {
  logger.info('someone pinged here');
  res.send('pong');
});

// static frontend
app.use(express.static(config.FRONTEND_PATH));

// routes
app.use('/auth', authRouter);
app.use('/api/invoices', invoiceRouter);
app.use('/api/customers', customerRouter);
app.use('/api/users', userRouter);
// app.use('/api/login', loginRouter);

// TODO: do I want to barrel export/import middleware
// e.g. app.use( middleware.unknownEndpoint )
// unknown endpoint
// NOTE: set to 500 for testing purposes
app.use((_, res) => {
  res.status(500).send({ error: 'Unknown endpoint' });
});

app.use(errorHandler);

export default app;

