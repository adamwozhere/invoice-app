import { Router } from 'express';

import {
  getAllInvoicesHandler,
  postInvoiceHandler,
} from '../controllers/invoice';
import validate from '../middleware/requestValidator';
import { invoiceSchema } from '../schemas/invoice.schema';

const router = Router();

router.get('/', getAllInvoicesHandler);
router.post('/', validate(invoiceSchema), postInvoiceHandler);

export default router;

