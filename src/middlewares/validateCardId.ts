import { NextFunction, Request, Response } from 'express';
import * as cardsServices from '../services/cardsServices.js';

export async function validateCardId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let cardId = Number(req.params.cardId);
  if (!cardId) cardId = req.body.cardId;
  const card = await cardsServices.getById(cardId);

  res.locals.card = card;

  next();
}
