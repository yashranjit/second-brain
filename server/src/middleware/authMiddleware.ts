import express from "express";
import { env } from "../config/processEnv.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "../utils/responseUtils.js";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const authMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res
      .status(StatusCodes.Unauthorized)
      .json({ message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(
      authHeader as string,
      env.JWT_SECRET,
    ) as JwtPayload;
    if (decoded && decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      return res
        .status(StatusCodes.Unauthorized)
        .json({ message: "Invalid token" });
    }
  } catch (err) {
    return res
      .status(StatusCodes.Unauthorized)
      .json({ message: "Invalid or expired token." });
  }
};
export { authMiddleware };
