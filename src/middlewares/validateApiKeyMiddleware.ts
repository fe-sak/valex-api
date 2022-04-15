import { NextFunction, Request, Response } from 'express';
import * as services from '../services/companiesServices.js';
import * as errors from '../errors/index.js';

export default async function validateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { 'x-api-key': key } = req.headers;

  if (Array.isArray(key) || !key) throw errors.Unauthorized();

  const company = await services.getCompany(key);
  if (!company) throw errors.Unauthorized();

  res.locals.company = company;

  next();
}
