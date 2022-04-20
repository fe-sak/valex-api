import { NextFunction, Request, Response } from 'express';
import * as services from '../services/companiesServices.js';

export default async function validateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const key = <string>req.headers['x-api-key'];

  if (!key) return res.sendStatus(401);

  const company = await services.getCompany(key);

  res.locals.company = company;

  next();
}
