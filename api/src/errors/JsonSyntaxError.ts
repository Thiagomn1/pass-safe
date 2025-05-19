import BaseError from "./BaseError";

class JsonSyntaxError extends BaseError {
  constructor(
    message: string = "Malformed JSON in request body",
    statusCode: number = 400
  ) {
    super(message, statusCode);
  }
}

export default JsonSyntaxError;
