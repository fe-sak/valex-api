import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.log({ error });

  if (error.type === 'unprocessable entity') return res.sendStatus(422);

  return res.sendStatus(500);
};

export default errorHandler;
