import { z } from "zod";
import projectSchema from "@/modules/project/project.validation";

export default interface IProject extends z.infer<typeof projectSchema> {}
