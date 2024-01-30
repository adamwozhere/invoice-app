import { Router } from 'express';
import { loginHandler, refreshHandler } from '../controllers/auth.controller';

const router = Router();

router.post('/login', loginHandler);
router.get('/refresh', refreshHandler);

export default router;

