import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { ContentSchema } from "../validators/contentSchema.js";
import { StatusCodes } from "../utils/responseUtils.js";
import mongoose, { Types } from "mongoose";
import { TagsModel } from "../models/Tags.js";
import { ContentModel } from "../models/Content.js";
const contentRouter = express.Router();

contentRouter.post("/add-content", authMiddleware, async (req, res) => {
  const parsedContentBody = ContentSchema.safeParse(req.body);
  // is zod validation is not success this code will be executed
  if (!parsedContentBody.success) {
    return res
      .status(StatusCodes.InvalidInput)
      .json({ message: parsedContentBody.error.issues });
  }

  // if zod validation is success then this code will be executed

  // we first destructure the data according to the model
  const { link, type, title, description, tags } = parsedContentBody.data;

  // here we make an array of ObjectIds to store all the ObjectIds in it and then save it DB
  // saying that the user used tags with those ObjectIds respectively
  const tagIds: Types.ObjectId[] = [];

  // now we check if the tags are present
  if (tags && tags.length > 0) {
    // if tags are present then we check the db using loop
    // for getting the ObjectIds of tags, if tag is present then we get ObjectId
    // if not present we create the tag in db

    for (const tagTitle of tags) {
      const normalizedTag = tagTitle.trim().toLowerCase();

      let tag = await TagsModel.findOne({ title: normalizedTag });
      if (!tag) {
        tag = await TagsModel.create({ title: normalizedTag });
      }
      // now we get the _ids of tags then we will push it the array

      tagIds.push(tag._id);
    }
  }
  // now we have the array of tags to put in content document
  try {
    await ContentModel.create({
      link,
      type,
      title,
      // so ekkada first spread operator use chesina
      // taruvatha description user pass chesthene db lo create avthadhi
      // description okkavela undefined aithe create kadhu.

      ...(description && { description }),
      tags: tagIds,
      userId: new mongoose.Types.ObjectId(req.userId),
    });
    return res.status(StatusCodes.Success).json({ message: "Content Added." });
  } catch (err) {
    console.log("Error adding content", err);
    res
      .status(StatusCodes.ServerError)
      .json({ message: "Internal Server Error." });
  }
});
