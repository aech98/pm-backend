import { HttpStatus } from "@/exceptions/status/exception.status";

class BaseError extends Error {
  public status: HttpStatus;
  public isKnown: boolean;

  constructor(status: HttpStatus, message: string, isKnown: boolean) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.status = status;
    this.isKnown = isKnown;

    Error.captureStackTrace(this);
  }
}

export default BaseError;
