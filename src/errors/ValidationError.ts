import CastError from "./CastError";

interface ValidationErrorDetails {
  errors: {
    [key: string]: { message: string };
  };
}

class ValidationError extends CastError {
  constructor(err?: unknown) {
    if (err && isValidationError(err)) {
      const errorMessages = Object.values(err.errors)
        .map((error) => error.message)
        .join("; ");
      super(`The following errors happened: ${errorMessages}`);
    } else {
      super("Validation failed due to invalid input.");
    }
  }
}

function isValidationError(err: unknown): err is ValidationErrorDetails {
  return (
    typeof err === "object" &&
    err !== null &&
    "errors" in err &&
    typeof (err as ValidationErrorDetails).errors === "object"
  );
}

export default ValidationError;
