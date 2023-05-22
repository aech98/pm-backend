import APIException from "@/exceptions/api.exception";
import Token from "@/interfaces/token.interface";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

export const createToken = (userId: string) => {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn: "10m",
  });
};

export const verifyToken = (token: string): Promise<Token> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, (err, payload) => {
      if (err) {
        return reject(err);
      }

      return resolve(payload as Token);
    });
  });
};
