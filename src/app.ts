import express, { Application } from "express";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import Controller from "@/interfaces/controller.interface";
import errorMiddleware from "@/middlewares/error.middleware";

class App {
  public express: Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;

    this.initMiddleware();
    this.initControllers(controllers);
    this.initErrorHandling();
  }

  private initMiddleware(): void {
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(morgan("dev"));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());
  }

  private initControllers(controllers: Controller[]): void {
    controllers.map((controller) => {
      this.express.use("/api", controller.router);
    });
  }

  private initErrorHandling(): void {
    this.express.use(errorMiddleware);
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`Application is listening on port: ${this.port}`);
    });
  }
}

export default App;
