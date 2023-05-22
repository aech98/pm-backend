import BaseError from "@/exceptions/base.exception";
import { HttpStatus } from "@/exceptions/status/exception.status";

class APIException extends BaseError {
  constructor(
    status: HttpStatus = HttpStatus.INTERNAL_SERVER,
    message: string = "Something went wrong",
    isKnown: boolean = false
  ) {
    super(status, message, isKnown);
  }
}

export default APIException;
