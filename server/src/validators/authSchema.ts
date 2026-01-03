import { z } from "zod";

const SignUpSchema = z.object({
  fullname: z.string().min(1, "Full name required."),
  email: z.email("Email is required."),
  password: z
    .string()
    .min(8, "At least 8 characters are required.")
    .max(20, "Max 20 characters."),
});

const SignInSchema = z.object({
  email: z.email("Email is required."),
  password: z
    .string()
    .min(8, "Minimum 8 characters are required.")
    .max(20, "Max 20 characters are required."),
});

export { SignUpSchema, SignInSchema };
