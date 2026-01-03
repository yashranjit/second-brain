import express from "express";
import {
  signInController,
  signUpController,
} from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/sign-up", signUpController);

authRouter.post("/sign-in", signInController);

export { authRouter };
