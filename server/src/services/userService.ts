import User from '../models/user.model';

export const getUsers = async () => {
  const users = await User.find({});
  return users;
};

export const createUser = async (email: string, passwordHash: string) => {
  const user = User.create({
    email,
    passwordHash,
  });

  return user;
};

