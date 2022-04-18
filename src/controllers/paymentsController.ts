import { Request, Response } from 'express';
import * as services from '../services/paymentsServices.js';

export async function createPayment(req: Request, res: Response) {
  const payment = req.body;

  await services.createPayment(payment);

  return res.sendStatus(201);
}

export async function createOnlinePayment(req: Request, res: Response) {
  const cardInfo = req.body;

  await services.createOnlinePayment(cardInfo);

  return res.sendStatus(201);
}
