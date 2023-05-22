import { z } from "zod";
import {
  loginValidation,
  registerValidation,
} from "@/modules/auth/auth.validation";

interface ILogin extends z.infer<typeof loginValidation> {}

interface IRegister extends z.infer<typeof registerValidation> {}

export { ILogin, IRegister };
