import Database from "@/configs/database";
import APIException from "@/exceptions/api.exception";
import BaseError from "@/exceptions/base.exception";
import { HttpStatus } from "@/exceptions/status/exception.status";
import UnauthorizedException from "@/exceptions/unauthorized.exception";
import IProject from "@/modules/project/project.interface";

class ProjectFactory {
  private db: Database;

  constructor() {
    this.db = new Database();
  }

  public async get(projectId: string) {
    try {
      const project = await this.db.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new APIException(HttpStatus.BAD_REQUEST, "Project does not exist");
      }

      return project;
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }

      throw new APIException(HttpStatus.BAD_REQUEST, "Unable to update project");
    }
  }

  public async create(dto: IProject, userId: string) {
    try {
      const project = await this.db.project.create({
        data: {
          ...dto,
          members: {
            create: [
              {
                userId: userId,
                role: "ADMIN",
              },
            ],
          },
        },
      });

      return project;
    } catch (error) {
      throw new APIException(HttpStatus.BAD_REQUEST, "Unable to create project");
    }
  }

  public async update(dto: IProject, projectId: string, userId: string) {
    try {
      const project = await this.db.project.findUnique({
        where: { id: projectId },
        include: { members: true },
      });

      if (!project) {
        throw new APIException(HttpStatus.BAD_REQUEST, "Project does not exist");
      }

      const isCreator = project.members.some(
        (user) => user.userId === userId && user.role === "ADMIN"
      );

      if (!isCreator) {
        throw new UnauthorizedException();
      }

      const updatedProject = await this.db.project.update({
        where: { id: projectId },
        data: { ...dto },
      });

      return updatedProject;
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }

      throw new APIException(HttpStatus.BAD_REQUEST, "Unable to update project");
    }
  }

  public async delete(projectId: string) {
    try {
      const project = await this.db.project.delete({
        where: { id: projectId },
      });

      return project;
    } catch (error) {
      throw new APIException(HttpStatus.BAD_REQUEST, "Unable to delete project");
    }
  }

  public async addMember(userEmail: string, projectId: string) {
    try {
      const userToAdd = await this.db.user.findUnique({ where: { email: userEmail } });

      if (!userToAdd) {
        throw new APIException(HttpStatus.BAD_REQUEST, "User does not exist");
      }

      const project = await this.db.project.update({
        where: { id: projectId },
        data: {
          members: {
            create: [
              {
                userId: userToAdd.id,
                role: "MEMBER",
              },
            ],
          },
        },
      });

      return { project, userToAdd };
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }

      throw new APIException(HttpStatus.BAD_REQUEST, "Unable to add user to project");
    }
  }
}

export default ProjectFactory;
