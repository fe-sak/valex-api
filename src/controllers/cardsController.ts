import { Request, Response } from 'express';

export function createCard(req: Request, res: Response) {
  console.log(res.locals.company);
}
