import { NextFunction, Request, Response } from 'express';
import * as cardsServices from '../services/cardsServices.js';

export async function validatePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { cardId, password } = req.body;

  await cardsServices.verifyPassword(cardId, password);

  next();
}
