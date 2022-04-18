import { Router } from 'express';
import validateApiKey from '../middlewares/validateApiKeyMiddleware.js';
import { validateSchema } from '../middlewares/validateSchemaMiddleware.js';
import schemas from '../schemas/index.js';
import * as controller from '../controllers/rechargesController.js';
import { validateCardId } from '../middlewares/validateCardId.js';

const rechargesRouter = Router();

rechargesRouter.post(
  '/recharges',
  validateApiKey,
  validateCardId,
  validateSchema(schemas.createRecharge),
  controller.create
);

export default rechargesRouter;
