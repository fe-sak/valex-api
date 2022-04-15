import { Request, Response } from 'express';
import * as services from '../services/rechargesServices.js';

export async function createRecharge(req: Request, res: Response) {
  const recharge = req.body;
  const { company } = res.locals;

  await services.createRecharge(recharge, company);

  return res.sendStatus(201);
}
