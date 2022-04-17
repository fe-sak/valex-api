import { NextFunction, Request, Response } from 'express';
import * as cardsServices from '../services/cardsServices.js';

export async function validatePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { card } = res.locals;
  const { password } = req.body;

  await cardsServices.verifyPassword(card, password);

  next();
}
