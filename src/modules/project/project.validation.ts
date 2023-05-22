import { z } from "zod";

const projectSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Dsescription is required"),
});

export default projectSchema;

export const userToAddSchema = z.object({
  email: z.string().email("Email is invalid").nonempty("Email is required"),
});
