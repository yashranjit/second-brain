import express from "express";
import { ContentSchema } from "../validators/contentSchema.js";
import { StatusCodes } from "../utils/responseUtils.js";
import mongoose, { Types } from "mongoose";
import { TagsModel } from "../models/Tags.js";
import { ContentModel } from "../models/Content.js";
const addContent = async (req: express.Request, res: express.Response) => {
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
};

const viewContent = async (req: express.Request, res: express.Response) => {
  // first userId ni ObjectId ki convert chestham,
  // endhukante auth middleware userId ni string la pampisthadhi
  // kakapothe manaki kavalsindhi ObjectId type
  const userid = new mongoose.Types.ObjectId(req.userId);
  try {
    // Ekkada manam userId tho db search chestham
    // ochina content lo manaki tag object id osthadhi manam dhani
    // tags title lo ki marchali, so populate() tho marustham
    // populate() loki collection and what we want we pass in there
    // next recent ga add chesina content ni first ocheyala chestham
    // dhaniki sort() ki with filter createdAt pass chesi, dhaniki -1 pedthe
    // descending order lo osthai ante normal ga createdAt ante first create chesinai osthai
    // kani manaki time lo recent ga add chesinai kavali kabbati -1
    const content = await ContentModel.find({ userId: userid }, "-userId")
      .populate("tags", "title")
      .sort({ createdAt: -1 });
    res.status(StatusCodes.Success).json(content);
  } catch (err) {
    res
      .status(StatusCodes.ServerError)
      .json({ message: "Error fetching data." });
  }
};
const deleteContent = async (req: express.Request, res: express.Response) => {
  const contentid = req.body.contentId;
  const userid = new mongoose.Types.ObjectId(req.userId);
  try {
    const result = await ContentModel.deleteOne({
      _id: contentid,
      userId: userid,
    });
    if (result.deletedCount === 0) {
      return res
        .status(StatusCodes.NotFound)
        .json({ message: "Content not found or not authorized." });
    }
    res.status(StatusCodes.Success).json({ message: "Deleted." });
  } catch (err) {
    res
      .status(StatusCodes.ServerError)
      .json({ message: "Error deleting content." });
  }
};

export { addContent, viewContent, deleteContent };
