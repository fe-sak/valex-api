import { Router } from 'express';
import * as controller from '../controllers/cardsController.js';
import validateApiKey from '../middlewares/validateApiKeyMiddleware.js';
import { validateCardAuth } from '../middlewares/validateCardAuthMiddleware.js';
import { validateCardId } from '../middlewares/validateCardId.js';
import validateEmployeeId from '../middlewares/validateEmployeeIdMiddleware.js';
import { validateSchema } from '../middlewares/validateSchemaMiddleware.js';
import schemas from '../schemas/index.js';

const cardsRouter = Router();

cardsRouter.get('/cards/:cardId', validateCardId, controller.getData);

cardsRouter.post(
  '/cards',
  validateApiKey,
  validateSchema(schemas.createCardSchema),
  validateEmployeeId,
  controller.create
);

cardsRouter.post('/cards/:cardId', validateCardAuth, controller.createVirtual);

cardsRouter.post('/cards/:cardId/block', validateCardAuth, controller.block);

cardsRouter.post(
  '/cards/:cardId/unblock',
  validateCardAuth,
  controller.unblock
);

cardsRouter.patch(
  '/cards/:cardId/activate',
  validateSchema(schemas.activateCardSchema),
  validateCardId,
  controller.activate
);

cardsRouter.delete('/cards/:cardId', validateCardAuth, controller.remove);

export default cardsRouter;
