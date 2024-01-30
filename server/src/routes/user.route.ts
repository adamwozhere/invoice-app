import { Router } from 'express';
import { createUserHandler, getAllUsersHandler } from '../controllers/user';

const router = Router();

router.get('/', getAllUsersHandler);
router.post('/', createUserHandler);

export default router;

