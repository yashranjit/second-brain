import mongoose, { Schema } from "mongoose";

const LinkSchema = new Schema({
  hash: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

const LinkModel = mongoose.model("Link", LinkSchema);
export { LinkModel };
