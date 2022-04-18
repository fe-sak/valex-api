import { Router } from 'express';
import * as controller from '../controllers/cardsController.js';
import validateApiKey from '../middlewares/validateApiKeyMiddleware.js';
import { validateCardId } from '../middlewares/validateCardId.js';
import validateEmployeeId from '../middlewares/validateEmployeeIdMiddleware.js';
import { validatePassword } from '../middlewares/validatePasswordMiddleware.js';
import { validateSchema } from '../middlewares/validateSchemaMiddleware.js';
import schemas from '../schemas/index.js';

const cardsRouter = Router();

cardsRouter.get('/cards/:cardId', validateCardId, controller.readCardData);

cardsRouter.post(
  '/cards',
  validateApiKey,
  validateSchema(schemas.createCardSchema),
  validateEmployeeId,
  controller.createCard
);

cardsRouter.post(
  '/cards/:cardId/virtual',
  validateCardId,
  validatePassword,
  controller.createVirtualCard
);

cardsRouter.post(
  '/cards/:cardId/block',
  validateCardId,
  validatePassword,
  controller.blockCard
);

cardsRouter.post(
  '/cards/:cardId/unblock',
  validateCardId,
  validatePassword,
  controller.unblockCard
);

cardsRouter.patch(
  '/cards/:cardId/activate',
  validateSchema(schemas.activateCardSchema),
  validateCardId,
  controller.activateCard
);

export default cardsRouter;
