import { Request, Response } from 'express';
import { createUser, getUsers } from '../services/userService';
import { CreateUserInput } from '../schemas/user.schema';

// this should probably just get the current user
export const getUsersHandler = async (_req: Request, res: Response) => {
  const users = await getUsers();
  return res.json(users);
};

export const createUserHandler = async (
  req: Request<object, object, CreateUserInput['body']>,
  res: Response
) => {
  const user = await createUser(req.body);

  return res.status(201).json(user);
};

// TODO: deleteUserHandler

// TODO: editUserHandler

