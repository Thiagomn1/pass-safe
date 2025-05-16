import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import BaseError from "../errors/BaseError";
import CastError from "../errors/CastError";
import ValidationError from "../errors/ValidationError";

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (err instanceof mongoose.Error.CastError) {
    new CastError().sendResponse(res);
    return;
  } else if (err instanceof mongoose.Error.ValidationError) {
    new ValidationError(err).sendResponse(res);
  } else if (err instanceof BaseError) {
    err.sendResponse(res);
  } else {
    new BaseError().sendResponse(res);
  }
};

export default errorHandler;
