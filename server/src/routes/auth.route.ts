import { Router } from 'express';
import {
  loginHandler,
  logoutHandler,
  refreshHandler,
} from '../controllers/auth.controller';
import { loginUserSchema } from '../schemas/user.schema';
import validate from '../middleware/requestValidator';

const router = Router();

router.post('/login', validate(loginUserSchema), loginHandler);
router.get('/refresh', refreshHandler);
router.get('/logout', logoutHandler);

export default router;

