import BaseError from "./BaseError";

class CastError extends BaseError {
  constructor(
    message: string = "One or more fields are incorrect",
    statusCode: number = 400
  ) {
    super(message, statusCode);
  }
}

export default CastError;
