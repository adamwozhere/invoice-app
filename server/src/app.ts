import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import config from './utils/config';
import logger from './utils/logger';
import db from './utils/db';

import invoiceRouter from './routes/invoice.route';
import customerRouter from './routes/customer.route';

import requestLogger from './middleware/requestLogger';
import errorHandler from './middleware/errorHandler';

const app = express();
app.use(express.json());
app.use(requestLogger);

mongoose.set('strictQuery', false);

void db.connect();

// healthcheck
app.get('/ping', (_, res) => {
  logger.info('someone pinged here');
  res.send('pong');
});

// static frontend
app.use(express.static(config.FRONTEND));

// routes
app.use('/api/invoices', invoiceRouter);
app.use('/api/customers', customerRouter);

// TODO: do I want to barrel export/import middleware
// e.g. app.use( middleware.unknownEndpoint )
// unknown endpoint
app.use((_, res) => {
  res.status(404).send({ error: 'Unknown endpoint' });
});

app.use(errorHandler);

export default app;

