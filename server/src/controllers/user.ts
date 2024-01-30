import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { createUser, getUsers } from '../services/userService';
import logger from '../utils/logger';

export const getAllUsersHandler = async (_req: Request, res: Response) => {
  const users = await getUsers();
  return res.json(users);
};

export const createUserHandler = async (
  req: Request<object, object, { email: string; password: string }>,
  res: Response
) => {
  const { email, password } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  logger.info(`passwordHash ${passwordHash}`);

  const user = await createUser(email, passwordHash);

  return res.status(201).json(user);
};

