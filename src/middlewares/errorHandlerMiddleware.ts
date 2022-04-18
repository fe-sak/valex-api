import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error) {
    return res.status(error.statusCode).send(error.message);
  }

  return res.sendStatus(500);
};

export default errorHandler;
