import { Router } from 'express';

import {
  deleteInvoiceHandler,
  getAllInvoicesHandler,
  getInvoiceHandler,
  postInvoiceHandler,
  putInvoiceByIdHandler,
} from '../controllers/invoice';
import validate from '../middleware/requestValidator';
import {
  createInvoiceSchema,
  deleteInvoiceSchema,
  editInvoiceSchema,
  getInvoiceByIdSchema,
} from '../schemas/invoice.schema';
import { authUser } from '../middleware/authUser';

const router = Router();

router.get('/', authUser, getAllInvoicesHandler);
router.get('/:id', validate(getInvoiceByIdSchema), getInvoiceHandler);
router.post('/', validate(createInvoiceSchema), postInvoiceHandler);
router.delete('/:id', validate(deleteInvoiceSchema), deleteInvoiceHandler);
// TODO: replace .deepPartial with a a different partial invoice Schema just for edits,
// also think about how to handle editing the item subdocuments - it may be that I have to replace the whole array,
// check how this is actually working in mongoose / returning json
router.put('/:id', validate(editInvoiceSchema), putInvoiceByIdHandler);

export default router;

