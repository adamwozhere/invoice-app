import { Router } from 'express';

import {
  deleteCustomerHandler,
  getAllCustomersHandler,
  getCustomerHandler,
  postCustomerHandler,
} from '../controllers/customer';
import validate from '../middleware/requestValidator';
import { customerSchema } from '../schemas/customer.schema';

const router = Router();

router.get('/', getAllCustomersHandler);
router.get('/:id', getCustomerHandler);
router.post('/', validate(customerSchema), postCustomerHandler);
router.delete('/:id', deleteCustomerHandler);

export default router;

