import Controller from "@/interfaces/controller.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { NextFunction, Request, Response, Router } from "express";
import projectSchema, { userToAddSchema } from "@/modules/project/project.validation";
import ProjectFactory from "./project.factory";
import IProject from "./project.interface";

class ProjectController implements Controller {
  public path: string;
  public router: Router;
  private projectFactory: ProjectFactory;

  constructor() {
    this.path = "/project";
    this.router = Router();
    this.projectFactory = new ProjectFactory();

    this.initRoutes();
  }

  private initRoutes() {
    this.router.post(
      `${this.path}/new`,
      [authMiddleware, validationMiddleware(projectSchema)],
      this.create
    );
    this.router.get(`${this.path}/:id`, authMiddleware, this.get);
    this.router.patch(
      `${this.path}/:id/update`,
      [authMiddleware, validationMiddleware(projectSchema)],
      this.update
    );
    this.router.delete(`${this.path}/:id/delete`, authMiddleware, this.delete);

    this.router.post(
      `${this.path}/:id/add_user`,
      [validationMiddleware(userToAddSchema), authMiddleware],
      this.addMember
    );
  }

  private get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: projectId } = req.params;
      const project = await this.projectFactory.get(projectId);
      return res.status(201).json({ success: true, project });
    } catch (error) {
      next(error);
    }
  };

  private create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: IProject = req.body;
      const { id: userId } = req.user;
      const project = await this.projectFactory.create(dto, userId);
      return res.status(201).json({ success: true, project });
    } catch (error) {
      next(error);
    }
  };

  private update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: IProject = req.body;
      const { id: projectId } = req.params;
      const { id: userId } = req.user;
      const project = await this.projectFactory.update(dto, projectId, userId);
      return res.status(201).json({ success: true, project });
    } catch (error) {
      next(error);
    }
  };

  private delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: projectId } = req.params;
      const project = await this.projectFactory.delete(projectId);
      return res.status(201).json({ success: true, project });
    } catch (error) {
      next(error);
    }
  };

  private addMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: projectId } = req.params;
      const { email: userEmail } = req.body;
      const addition = await this.projectFactory.addMember(userEmail, projectId);
      return res.status(201).json({ success: true, addition });
    } catch (error) {
      next(error);
    }
  };
}

export default ProjectController;
