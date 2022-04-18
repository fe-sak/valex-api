import { NextFunction, Request, Response } from 'express';
import * as cardsServices from '../services/cardsServices.js';

export async function validateCardAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { password } = req.body;

  let cardId = Number(req.params.cardId);
  if (!cardId) cardId = req.body.cardId;
  const card = await cardsServices.getById(cardId);

  await cardsServices.verifyPassword(card, password);

  res.locals.card = card;

  next();
}
