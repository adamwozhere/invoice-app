import { Router } from 'express';
import { loginHandler } from '../controllers/login';

const router = Router();

router.post('/', loginHandler);

export default router;

