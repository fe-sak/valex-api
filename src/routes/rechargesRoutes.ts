import { Router } from 'express';
import validateApiKey from '../middlewares/validateApiKeyMiddleware.js';
import { validateSchema } from '../middlewares/validateSchemaMiddleware.js';
import schemas from '../schemas/index.js';
import * as controller from '../controllers/rechargesController.js';

const rechargesRouter = Router();

rechargesRouter.post(
  '/recharges',
  validateApiKey,
  validateSchema(schemas.createRecharge),
  controller.createRecharge
);

export default rechargesRouter;
