import { Request, Response } from 'express';
import * as services from '../services/rechargesServices.js';

export async function create(req: Request, res: Response) {
  const recharge = req.body;
  const { company, card } = res.locals;

  await services.recharge(recharge, company, card);

  return res.sendStatus(201);
}
