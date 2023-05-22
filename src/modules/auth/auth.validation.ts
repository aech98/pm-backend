import { z } from "zod";

const loginValidation = z.object({
  email: z.string(),
  password: z.string(),
});

const registerValidation = z.object({
  username: z
    .string()
    .nonempty("username cannot be empty")
    .min(3, "username must be at least 3 characters"),

  email: z
    .string()
    .nonempty("email cannot be empty")
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "password must at least 8 characters")
    .regex(/^/, "password is too weak"),
});

export { loginValidation, registerValidation };
