import { Router } from 'express';
import * as controller from '../controllers/paymentsController.js';
import { validateCardId } from '../middlewares/validateCardId.js';
import { validatePassword } from '../middlewares/validatePasswordMiddleware.js';
import { validateSchema } from '../middlewares/validateSchemaMiddleware.js';
import schemas from '../schemas/index.js';

const paymentsRouter = Router();

paymentsRouter.post(
  '/payments',
  validateSchema(schemas.createPaymentSchema),
  validateCardId,
  validatePassword,
  controller.createPayment
);

paymentsRouter.post(
  '/payments/online',
  validateSchema(schemas.createOnlinePaymentSchema),
  controller.createOnlinePayment
);

export default paymentsRouter;
