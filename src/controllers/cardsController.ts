import { Request, Response } from 'express';
import * as services from '../services/cardsServices.js';

export async function readCardData(req: Request, res: Response) {
  const cardId = Number(req.params.cardId);

  const data = await services.readData(cardId);

  return res.send(data);
}

export async function createCard(req: Request, res: Response) {
  const { cardType } = req.body;
  const { employee, company } = res.locals;

  const card = await services.create(employee, company, cardType);

  return res.send(card);
}

export async function activateCard(req: Request, res: Response) {
  const { password, securityCode } = req.body;
  const cardId = parseInt(req.params.cardId);

  await services.activate(securityCode, password, cardId);

  return res.send('Card successfully activated.');
}
