import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { CreateUserInput } from '../schemas/user.schema';

export const getUsers = async () => {
  const users = await User.find({});
  return users;
};

export const createUser = async (input: CreateUserInput['body']) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(input.password, saltRounds);

  const user = await User.create({
    name: input.name,
    email: input.email,
    password: passwordHash,
  });

  return user;
};

