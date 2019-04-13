import { NextFunction, Request, Response } from 'express';

export let logging = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(err);
  next(err);
};

export let clientErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err);
  }
};

export let errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).send({ error: err.message });
};
