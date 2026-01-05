import express from "express";
import { LinkModel } from "../models/Link.js";
import { StatusCodes } from "../utils/responseUtils.js";
import { randomStringGen } from "../utils/hash.js";
import { ContentModel } from "../models/Content.js";
import { UserModel } from "../models/User.js";

const shareLink = async (req: express.Request, res: express.Response) => {
  // check if there is a link in db
  try {
    const existingLink = await LinkModel.findOne({
      userId: req.userId!,
    });
    // if there is a link then return it, we dont have to create a new one.
    if (existingLink) {
      return res.status(StatusCodes.Success).json({ hash: existingLink.hash });
    }
    const hash = randomStringGen(10);
    await LinkModel.create({
      hash,
      userId: req.userId!,
    });
    res.status(StatusCodes.Success).json({ hash: hash });
  } catch (err) {
    res.status(StatusCodes.ServerError).json({ message: "Server Error." });
  }
};

const getShareLink = async (req: express.Request, res: express.Response) => {
  const hash = req.params.shareLink;
  try {
    const link = await LinkModel.findOne({ hash: hash! });
    if (!link) {
      return res
        .status(StatusCodes.NotFound)
        .json({ message: "Link not found or expired." });
    }
    const content = await ContentModel.find({ userId: link.userId })
      .populate("tags", "title")
      .sort({ createdAt: -1 });
    const user = await UserModel.findOne({ _id: link.userId }).select(
      "fullname",
    );
    if (!user) {
      return res
        .status(StatusCodes.ServerError)
        .json({ message: "User data corrupted." });
    }
    res.status(StatusCodes.Success).json({
      username: user.fullname,
      content: content,
    });
  } catch (err) {
    res.status(StatusCodes.ServerError).json({ message: "Server error." });
  }
};

export { shareLink, getShareLink };
