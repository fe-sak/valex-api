import { Router } from 'express';
import cardsRouter from './cardsRoutes.js';

const router = Router();

router.use(cardsRouter);

export default router;
