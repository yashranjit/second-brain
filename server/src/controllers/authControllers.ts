import express from "express";
import { z } from "zod";
import { UserModel } from "../models/User.js";
import bcrypt from "bcrypt";
import { SignUpSchema, SignInSchema } from "../validators/authSchema.js";
import jwt from "jsonwebtoken";
import { env } from "../config/processEnv.js";
import { StatusCodes } from "../utils/responseUtils.js";
type SignUp = z.infer<typeof SignUpSchema>;
type SignIn = z.infer<typeof SignInSchema>;

const signUpController = async (
  req: express.Request,
  res: express.Response,
) => {
  const parsedBody = SignUpSchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res
      .status(StatusCodes.InvalidInput)
      .json({ message: parsedBody.error.issues });
  }
  const { fullname, email, password }: SignUp = parsedBody.data;
  try {
    const hassedPassword = await bcrypt.hash(password, 10);
    await UserModel.create({
      fullname,
      email,
      password: hassedPassword,
    });
    res
      .status(StatusCodes.Success)
      .json({ message: "You have Signed Up! Proceed to sign in." });
  } catch (err: any) {
    if (err.code === 11000) {
      return res
        .status(StatusCodes.UserAlreadyExists)
        .json({ message: "User already exists." });
    }
    console.log("Sign Up error: ", err);
    res
      .status(StatusCodes.ServerError)
      .json({ message: "Internal Server Error." });
  }
};

const signInController = async (
  req: express.Request,
  res: express.Response,
) => {
  const requiredBody = SignInSchema.safeParse(req.body);
  if (!requiredBody.success) {
    return res.status(StatusCodes.InvalidInput).json(requiredBody.error.issues);
  }
  const { email, password }: SignIn = requiredBody.data;
  const signedUpUser = await UserModel.findOne({ email });
  if (!signedUpUser) {
    return res
      .status(StatusCodes.Unauthorized)
      .json({ message: "Invalid Credentials." });
  }
  const passwordCheck = await bcrypt.compare(password, signedUpUser.password);
  if (passwordCheck) {
    const token = jwt.sign(
      { userId: signedUpUser._id.toString() },
      env.JWT_SECRET,
    );
    return res.status(StatusCodes.Success).json({ token });
  }
  res
    .status(StatusCodes.Unauthorized)
    .json({ message: "Invalid Credentials." });
};

export { signUpController, signInController };
