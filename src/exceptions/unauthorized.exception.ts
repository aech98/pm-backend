import BaseError from "./base.exception";
import { HttpStatus } from "@/exceptions/status/exception.status";

class UnauthorizedException extends BaseError {
  constructor(
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    message: string = "Not authorized"
  ) {
    super(status, message, true);
  }
}

export default UnauthorizedException;
