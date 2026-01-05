import mongoose, { Schema } from "mongoose";

const contentTypes = [
  "link",
  "image",
  "audio",
  "video",
  "tweet",
  "youtube",
  "document",
] as const;

const ContentSchema = new Schema(
  {
    link: { type: String },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    description: { type: String },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

const ContentModel = mongoose.model("Content", ContentSchema);
export { ContentModel };
