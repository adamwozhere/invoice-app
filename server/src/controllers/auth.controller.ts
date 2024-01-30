import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import User, { UserDocument } from '../models/user.model';

export const loginHandler = async (
  req: Request<object, object, { email: string; password: string }>,
  res: Response
) => {
  const { email, password } = req.body;
  const user = await User.findOne<UserDocument>({ email });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const userData = {
    email: user.email,
    id: user.id,
    sub: user.id,
  };

  const accessToken = jwt.sign(userData, 'access-token-secret', {
    expiresIn: '30s',
  });

  const refreshToken = jwt.sign(userData, 'refresh-token-secret', {
    expiresIn: '5m',
  });

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken, email: user.email });
};

// NOTE: can either extend Request, or redeclare  it

interface RequestWithCookie extends Request {
  cookies: { jwt?: string };
}

// // redeclare Request with cookies
// declare module 'express' {
//   type ReqCookies = Record<string, string>;

//   export interface Request {
//     cookies: ReqCookies;
//   }
// }

export const refreshHandler = async (req: RequestWithCookie, res: Response) => {
  const { cookies } = req;

  logger.info(`cookie: ${JSON.stringify(cookies)}`);
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.jwt;

  // const foundUser = await User.findById(refreshToken['sub']);

  const foundUser = await User.findOne({ refreshToken });

  if (!foundUser) {
    return res.sendStatus(403); // Forbidden
  }

  const decoded = jwt.verify(refreshToken, 'refresh-token-secret');
  if (foundUser.id !== decoded.sub) {
    return res.sendStatus(403); // Forbidden
  }

  // TODO: fix typings for id as string
  const userData = {
    email: foundUser.email,
    id: foundUser.id as string,
    sub: foundUser.id as string,
  };

  const accessToken = jwt.sign(userData, 'access-token-secret', {
    expiresIn: '30s',
  });

  // TODO: implement returning refresh token with token rotation
  const newRefreshToken = jwt.sign(userData, 'refresh-token-secret', {
    expiresIn: '1y',
  });

  res.json({ accessToken });
};

