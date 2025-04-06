import mongoose from "mongoose";

const forumPostSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export const ForumPost = mongoose.model("ForumPost", forumPostSchema);
