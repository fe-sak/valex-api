import { Request, Response } from 'express';
import * as services from '../services/cardsServices.js';

export async function getData(_req: Request, res: Response) {
  const { card } = res.locals;

  const data = await services.getData(card);

  return res.send(data);
}

export async function create(req: Request, res: Response) {
  const { cardType } = req.body;
  const { employee } = res.locals;

  const card = await services.create(employee, cardType);

  return res.status(201).send(card);
}

export async function createVirtual(_req: Request, res: Response) {
  const { card } = res.locals;

  const virtualCard = await services.createVirtual(card);

  return res.status(201).send(virtualCard);
}

export async function activate(req: Request, res: Response) {
  const { password, securityCode } = req.body;
  const { card } = res.locals;

  await services.activate(securityCode, password, card);

  return res.sendStatus(200);
}

export async function block(_req: Request, res: Response) {
  const { card } = res.locals;

  await services.block(card);

  return res.sendStatus(200);
}

export async function unblock(_req: Request, res: Response) {
  const { card } = res.locals;

  await services.unblock(card);

  return res.sendStatus(200);
}

export async function remove(_req: Request, res: Response) {
  const { card } = res.locals;

  await services.remove(card);

  return res.sendStatus(200);
}
