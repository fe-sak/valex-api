import { NextFunction, Request, Response } from 'express';
import * as services from '../services/employeesServices.js';

export default async function validateEmployeeId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { employeeId }: { employeeId: number } = req.body;
  const { company } = res.locals;

  const employee = await services.getById(employeeId, company);

  res.locals.employee = employee;

  next();
}
