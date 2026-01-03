import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DB_URL: z.string().min(1, "DB_URL is required."),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required."),
});

export { envSchema };
