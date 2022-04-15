import { Router } from 'express';
import * as controller from '../controllers/paymentsController.js';
import { validatePassword } from '../middlewares/validatePasswordMiddleware.js';
import { validateSchema } from '../middlewares/validateSchemaMiddleware.js';
import schemas from '../schemas/index.js';

const paymentsRouter = Router();

paymentsRouter.post(
  '/payments',
  validateSchema(schemas.createPaymentSchema),
  validatePassword,
  controller.createPayment
);

export default paymentsRouter;
