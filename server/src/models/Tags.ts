import mongoose, { Schema } from "mongoose";

const TagsSchema = new Schema({
  title: { type: String, required: true, unique: true },
});

const TagsModel = mongoose.model("Tag", TagsSchema);
export { TagsModel };
