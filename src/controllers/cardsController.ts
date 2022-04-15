import { Request, Response } from 'express';
import * as services from '../services/cardServices.js';

export async function createCard(req: Request, res: Response) {
  const { cardType } = req.body;
  const { employee } = res.locals;
  const { company } = res.locals;

  const card = await services.createCard(employee, company, cardType);
  console.log({ card });
}
