import { ZodIssue } from "zod";
import BaseError from "./BaseError";

class ZodError extends BaseError {
  constructor(
    details: ZodIssue[] = [],
    message: string = "ZOD Validation failed",
    statusCode: number = 400
  ) {
    super(message, statusCode);
  }
}

export default ZodError;
