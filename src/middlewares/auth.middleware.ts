import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import Database from "@/configs/database";
import { verifyToken } from "@/utils/token";
import UnauthorizedException from "@/exceptions/unauthorized.exception";
import APIException from "@/exceptions/api.exception";
import { HttpStatus } from "@/exceptions/status/exception.status";

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const bearer = req.headers.authorization;

  if (bearer && bearer.startsWith("Bearer ")) {
    const token = bearer.split(" ")[1];

    verifyToken(token)
      .then(async (payload) => {
        const user = await new Database().user.findUnique({
          where: {
            id: payload.sub,
          },
        });
        if (!user) throw new UnauthorizedException();
        req.user = { id: user.id };
        return next();
      })
      .catch((error) => {
        if (error instanceof TokenExpiredError) {
          return next(new APIException(HttpStatus.BAD_REQUEST, "Token expired"));
        }

        if (error instanceof JsonWebTokenError) {
          return next(new APIException(HttpStatus.BAD_REQUEST, "Unable to parse token"));
        }

        return next(new APIException());
      });
  } else {
    return next(new UnauthorizedException());
  }
}
