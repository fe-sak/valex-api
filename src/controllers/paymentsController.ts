import { Request, Response } from 'express';
import * as services from '../services/paymentsServices.js';

export async function create(req: Request, res: Response) {
  const { card } = res.locals;
  const payment = req.body;

  await services.pay(payment, card);

  return res.sendStatus(201);
}

export async function createOnline(req: Request, res: Response) {
  const cardInfo = req.body;

  await services.onlinePay(cardInfo);

  return res.sendStatus(201);
}
