import { Router } from 'express';
import cardsRouter from './cardsRoutes.js';
import paymentsRouter from './paymentsRoutes.js';
import rechargesRouter from './rechargesRoutes.js';

const router = Router();

router.use(cardsRouter);
router.use(rechargesRouter);
router.use(paymentsRouter);

export default router;
