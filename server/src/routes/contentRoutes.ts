import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addContent,
  deleteContent,
  viewContent,
} from "../controllers/contentController.js";

const contentRouter = express.Router();

contentRouter.post("/add-content", authMiddleware, addContent);

contentRouter.get("/view-brain", authMiddleware, viewContent);

contentRouter.delete("/delete-content", authMiddleware, deleteContent);

export { contentRouter };
