import { NextFunction, Request, Response } from 'express';
import * as services from '../services/authServices.js';
import * as errors from '../errors/index.js';

export default async function validateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { 'x-api-key': key } = req.headers;

  if (Array.isArray(key) || !key) throw errors.UnprocessableEntity();

  const company = await services.validateKey(key);

  res.locals.company = company;
  next();
}
