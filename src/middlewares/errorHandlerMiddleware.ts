import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.log({ error });

  return res.sendStatus(500);
};

export default errorHandler;
