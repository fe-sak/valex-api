import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const { type, message } = error;

  if (type === 'not found') return res.sendStatus(404);

  if (type === 'unprocessable entity' && message)
    return res.status(422).send(message);

  if (type === 'unauthorized') return res.sendStatus(401);

  if (type === 'forbidden' && message) return res.status(403).send(message);
  console.error(error);

  return res.sendStatus(500);
};

export default errorHandler;
