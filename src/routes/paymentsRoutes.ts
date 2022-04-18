import { Router } from 'express';
import * as controller from '../controllers/paymentsController.js';
import { validateCardAuth } from '../middlewares/validateCardAuthMiddleware.js';
import { validateSchema } from '../middlewares/validateSchemaMiddleware.js';
import schemas from '../schemas/index.js';

const paymentsRouter = Router();

paymentsRouter.post(
  '/payments',
  validateSchema(schemas.createPaymentSchema),
  validateCardAuth,
  controller.create
);

paymentsRouter.post(
  '/payments/online',
  validateSchema(schemas.createOnlinePaymentSchema),
  controller.createOnline
);

export default paymentsRouter;
