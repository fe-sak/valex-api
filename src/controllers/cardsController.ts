import { Request, Response } from 'express';
import * as services from '../services/cardsServices.js';

export async function readCardData(_req: Request, res: Response) {
  const {
    card: { id: cardId },
  } = res.locals;

  const data = await services.readData(cardId);

  return res.send(data);
}

export async function createCard(req: Request, res: Response) {
  const { cardType } = req.body;
  const { employee, company } = res.locals;

  const card = await services.create(employee, company, cardType);

  return res.send(card);
}

export async function createVirtualCard(req: Request, res: Response) {
  const { card } = res.locals;

  const virtualCard = await services.createVirtual(card);

  return res.send(virtualCard);
}

export async function activateCard(req: Request, res: Response) {
  const { password, securityCode } = req.body;
  const { card } = res.locals;

  await services.activate(securityCode, password, card);

  return res.send('Card activated.');
}

export async function blockCard(req: Request, res: Response) {
  const { card } = res.locals;

  await services.block(card);

  return res.sendStatus(200);
}

export async function unblockCard(req: Request, res: Response) {
  const { card } = res.locals;

  await services.unblock(card);

  return res.sendStatus(200);
}
