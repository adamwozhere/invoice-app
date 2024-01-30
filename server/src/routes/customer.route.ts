import { Router } from 'express';

import {
  deleteCustomerHandler,
  getAllCustomersHandler,
  getCustomerHandler,
  postCustomerHandler,
  putCustomerByIdHandler,
} from '../controllers/customer';
import validate from '../middleware/requestValidator';
import {
  createCustomerSchema,
  deleteCustomerSchema,
  editCustomerSchema,
  getCustomerByIdSchema,
} from '../schemas/customer.schema';

const router = Router();

router.get('/', getAllCustomersHandler);
router.get('/:id', validate(getCustomerByIdSchema), getCustomerHandler);
router.post('/', validate(createCustomerSchema), postCustomerHandler);
router.delete('/:id', validate(deleteCustomerSchema), deleteCustomerHandler);
router.put('/:id', validate(editCustomerSchema), putCustomerByIdHandler);

export default router;

