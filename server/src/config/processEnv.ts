import dotenv from "dotenv";
import { envSchema } from "../validators/envSchema.js";
dotenv.config();

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.log("Invalid environmental variables:\n", parsedEnv.error);
  process.exit(1);
}
export const env = parsedEnv.data;
