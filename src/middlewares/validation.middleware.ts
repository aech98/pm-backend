import APIException from "@/exceptions/api.exception";
import { HttpStatus } from "@/exceptions/status/exception.status";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { z } from "zod";

export default function validationMiddleware(schema: z.Schema): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const value = await schema.parseAsync(req.body);
      req.body = value;
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const message: string[] = [];
        err.errors.map((e) => message.push(e.message));
        next(new APIException(HttpStatus.BAD_REQUEST, JSON.stringify(message)));
      }
    }
  };
}
