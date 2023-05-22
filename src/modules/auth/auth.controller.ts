import { Router, Request, Response, NextFunction } from "express";

import Controller from "@/interfaces/controller.interface";
import validationMiddleware from "@/middlewares/validation.middleware";
import {
  loginValidation,
  registerValidation,
} from "@/modules/auth/auth.validation";
import AuthFactory from "@/modules/auth/auth.factory";

class AuthController implements Controller {
  public path: string;
  public router: Router;
  private auth: AuthFactory;

  constructor() {
    this.path = "/auth";
    this.router = Router();
    this.auth = new AuthFactory();

    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(loginValidation),
      this.login
    );
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(registerValidation),
      this.register
    );
  }

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const token = await this.auth.register(req.body);
      res.status(201).json({ success: true, access_token: token });
    } catch (error) {
      next(error);
    }
  };

  private login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const token = await this.auth.login(req.body);
      res.status(200).json({ success: true, access_token: token });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
