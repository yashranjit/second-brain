import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getShareLink, shareLink } from "../controllers/linkController.js";

const linkRouter = express.Router();

linkRouter.post("/share", authMiddleware, shareLink);

linkRouter.get("/:shareLink", getShareLink);

export { linkRouter };
