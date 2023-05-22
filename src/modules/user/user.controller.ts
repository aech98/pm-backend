import { NextFunction, Request, Response, Router } from "express";

import Controller from "@/interfaces/controller.interface";
import authMiddleware from "@/middlewares/auth.middleware";

class UserController implements Controller {
  public path: string;
  public router: Router;

  constructor() {
    this.path = "/user";
    this.router = Router();

    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(`${this.path}/`, authMiddleware, this.getUser);
  }

  public async getUser(req: Request, res: Response, next: NextFunction) {
    // const user = await new Database().user.findUnique({
    //   where: {
    //     id: payload.sub,
    //   },
    // });

    // if (!user) {
    //   throw next(new UnauthorizedException());
    // }
    return res.status(200).json({ success: true, message: "Me" });
  }
}

export default UserController;
