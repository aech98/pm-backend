import "dotenv/config";
import "module-alias/register";

import App from "app";
import validateEnv from "@/utils/validate-env";
import AuthController from "@/modules/auth/auth.controller";
import ProjectController from "@/modules/project/project.controller";

validateEnv();

const app = new App(
  [new AuthController(), new ProjectController()],
  Number(process.env.PORT)
);
app.listen();
