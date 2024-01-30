import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

import User from '../models/user.model';

export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get('authorization');
  if (!authHeader) {
    return res.sendStatus(401);
  }

  logger.info(authHeader);
  const token = authHeader.replace(/^Bearer\s/, '');
  const decoded = jwt.verify(token, 'access-token-secret');

  logger.info(JSON.stringify(decoded));

  // TODO: get / access custom data: email, id etc.
  const user = await User.findOne({ _id: decoded.sub });
  if (!user) {
    return res.sendStatus(400); // unsure of return code as jwt valid, but no matching user in db
  }

  // add user object to req / res cycle
  res.locals.user = user?.toJSON();

  next();
};

