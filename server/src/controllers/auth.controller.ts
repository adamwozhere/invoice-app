import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import User, { UserDocument } from '../models/user.model';

// TODO: proper config for getting the jwt secrets from env vars. keeping them typed etc, and the jwt.sub ? or use jwt.id ?
// TODO: jwt / cookie options object for being able to change secure cookies on and off for dev/test or production
// TODO: password validation in the user.model or auth.service, and put auth util functions in there ? or jwt utils in /utils ?

export const loginHandler = async (
  req: Request<object, object, { email: string; password: string }>,
  res: Response
) => {
  const { cookies } = req;
  const { email, password } = req.body;

  const user = await User.findOne<UserDocument>({ email });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!user || !passwordCorrect) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // password is correct

  const userData = {
    email: user.email,
    id: user.id,
    sub: user.id,
  };

  const accessToken = jwt.sign(userData, 'access-token-secret', {
    // expiresIn: '30s',
    expiresIn: '10m',
  });

  const newRefreshToken = jwt.sign(userData, 'refresh-token-secret', {
    // expiresIn: '5m',
    expiresIn: '1y',
  });

  // get users refresh tokens array, and remove current token from cookie if cookie present
  let newRefreshTokenArray = cookies?.jwt
    ? user.refreshToken.filter((t) => t !== cookies.jwt)
    : user.refreshToken;

  if (cookies?.jwt) {
    // scenario:
    // 1) User logs in but never uses RT and does not logout
    // 2) RT is stolen
    // 3) If 1 and 2, reuse detection is needed to clear all RTs when user logs in

    const refreshToken = cookies.jwt;
    const foundToken = await User.findOne({ refreshToken });

    // detected refresh token reuse
    if (!foundToken) {
      logger.info('attempted refresh token reuse at login');
      // remove all refresh tokens from user
      newRefreshTokenArray = [];
    }

    // clear cookie
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: false });
  }

  user.refreshToken = [...newRefreshTokenArray, newRefreshToken];

  // log result for debug
  const result = await user.save();
  logger.info(JSON.stringify(result));

  res.cookie('jwt', newRefreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.json({ accessToken, email: user.email });
};

export const logoutHandler = async (req: Request, res: Response) => {
  // NOTE: Also need to delete bearer token on client

  const { cookies } = req;

  logger.info(`logoutHandler cookies are: ${JSON.stringify(cookies)}`);

  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.jwt;
  logger.info(`logout: refreshToken: ${JSON.stringify(refreshToken)}`);

  // is refresh token in db ?
  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: false });
    return res.sendStatus(204); // No content
  }

  // delete refreshToken in db
  foundUser.refreshToken = foundUser.refreshToken.filter(
    (t) => t !== refreshToken
  );
  const result = await foundUser.save();
  logger.info(JSON.stringify(result));

  // TODO: note that may need to set cors credentials whitelist / allowedOrigins for chrome
  // also add sameSite: 'None', secure: true
  // NOTE: secure: true does not work in thunderclient so have set to false currently,
  // TODO: add check for production/dev - set cookie options secure: true if in production mode
  // https://www.youtube.com/watch?v=favjC6EKFgw&list=PL0Zuz27SZ-6PFkIxaJ6Xx_X46avTM1aYw&index=16&ab_channel=DaveGray

  // res.header('Access-Control-Allow-Credentials', 'true') ;???

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: false });

  return res.sendStatus(204); // No content
};

export const refreshHandler = async (req: Request, res: Response) => {
  const { cookies } = req;

  logger.info(`cookie: ${JSON.stringify(cookies)}`);
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.jwt;
  res.clearCookie('jwt');

  const foundUser = await User.findOne<UserDocument>({ refreshToken }); // add .exec() at the end?

  if (!foundUser) {
    // token reuse detected! - cookie present but has already been deleted from db
    // only applies if storing multiple tokens in an array e.g. multiple devices

    // if so, decode the token to get user, and delete ALL user refresh tokens
    const decoded = jwt.verify(refreshToken, 'refresh-token-secret');
    logger.info('attempted refresh token reuse');
    const userFromToken = await User.findOne({ _id: decoded.sub });

    userFromToken!.refreshToken = [];
    const result = await userFromToken?.save();

    logger.info(JSON.stringify(result));

    return res.sendStatus(403); // Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (t) => t !== refreshToken
  );

  // evaluate jwt
  try {
    const decoded = jwt.verify(refreshToken, 'refresh-token-secret');
    // should I be using jwt.sub here? - what do I actually need in the jwt? what can the front end actually use?
    if (foundUser.id !== decoded.sub) {
      return res.sendStatus(403); // Forbidden
    }

    const userData = {
      email: foundUser.email, // tutorial just uses username
      id: foundUser.id,
      sub: foundUser.id,
    };

    const accessToken = jwt.sign(userData, 'access-token-secret', {
      expiresIn: '30s',
    });

    const newRefreshToken = jwt.sign(userData, 'refresh-token-secret', {
      expiresIn: '1y',
    });

    // save refresh token with current user
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();
    logger.info(JSON.stringify(result));

    // create new refreshToken cookie
    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // send back access token and any other data (could send the user details etc?)
    return res.json({ accessToken });
  } catch (err) {
    // remove token
    logger.info('refresh token expired');
    foundUser.refreshToken = [...newRefreshTokenArray];
    const result = await foundUser.save();
    logger.info(JSON.stringify(result));
  }
};

