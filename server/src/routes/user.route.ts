import { Router } from 'express';
import {
  createUserHandler,
  getUsersHandler,
} from '../controllers/user.controller';
import { createUserSchema } from '../schemas/user.schema';
import validate from '../middleware/requestValidator';
import { authUser } from '../middleware/authUser';

const router = Router();

router.get('/', authUser, getUsersHandler);
router.post('/', validate(createUserSchema), createUserHandler);

export default router;

