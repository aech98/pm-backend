import { Request, Response, NextFunction } from "express";
import BaseError from "@/exceptions/base.exception";

export default function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (error instanceof BaseError) {
    console.log(error);
    res.status(error.status).send({ message: error.message });
    return;
  }

  console.log(error);
  process.exit(1);
}
