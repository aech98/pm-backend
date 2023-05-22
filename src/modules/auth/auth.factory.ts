import * as argon from "argon2";
import { Prisma } from "@prisma/client";

import Database from "@/configs/database";
import { createToken } from "@/utils/token";
import { ILogin, IRegister } from "@/modules/auth/auth.interface";
import APIException from "@/exceptions/api.exception";
import BaseError from "@/exceptions/base.exception";
import { HttpStatus } from "@/exceptions/status/exception.status";

class AuthFactory {
  private db: Database;

  constructor() {
    this.db = new Database();
  }

  public async login(data: ILogin): Promise<string> {
    try {
      const user = await this.db.user.findUnique({
        where: {
          email: data.email,
        },
      });
      if (user) {
        const pwMatches = await argon.verify(user.hash, data.password);
        if (pwMatches) {
          return createToken(user.id);
        } else {
          throw new APIException(HttpStatus.BAD_REQUEST, "Invalid credentials");
        }
      } else {
        throw new APIException(HttpStatus.BAD_REQUEST, "Invalid credentials");
      }
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }

      throw new APIException();
    }
  }

  public async register(data: IRegister): Promise<string> {
    try {
      const hash = await argon.hash(data.password);

      const user = await this.db.user.create({
        data: {
          username: data.username,
          email: data.email,
          hash,
        },
      });

      return createToken(user.id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new APIException(
            HttpStatus.CONFLICT,
            "Credentials already exists"
          );
        }
      }

      throw new APIException();
    }
  }
}

export default AuthFactory;
