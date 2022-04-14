import { Router } from 'express';
import * as controller from '../controllers/cardsController.js';
import validateApiKey from '../middlewares/validateApiKeyMiddleware.js';

const cardsRouter = Router();

cardsRouter.post('/cards', validateApiKey, controller.createCard);

export default cardsRouter;
