import { Router } from 'express';
import * as controller from '../controllers/cardsController.js';
import validateApiKey from '../middlewares/validateApiKeyMiddleware.js';
import validateEmployeeId from '../middlewares/validateEmployeeIdMiddleware.js';
import { validateSchema } from '../middlewares/validateSchemaMiddleware.js';
import schemas from '../schemas/index.js';

const cardsRouter = Router();

cardsRouter.post(
  '/cards',
  validateApiKey,
  validateSchema(schemas.createCardSchema),
  validateEmployeeId,
  controller.createCard
);

cardsRouter.patch(
  '/cards/:cardId',
  validateSchema(schemas.activateCardSchema),
  controller.activateCard
);

export default cardsRouter;
