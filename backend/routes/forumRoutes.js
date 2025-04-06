import express from "express";
import { ForumPost } from "../models/forumModel.js";
import { User } from "../models/userModel.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// Create a new forum post
router.post("/create", isAuth,async (req, res) => {
  try {
    const {  title, content } = req.body;
    const userId=req.user._id;

    const user = await User.findById(userId);

    if (!user || user.role !== "farmer") {
      return res.status(403).json({ message: "Only farmers can create posts" });
    }

    const newPost = new ForumPost({ farmer: userId, title, content });
    await newPost.save();

    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all forum posts
router.get("/all", async (req, res) => {
  try {
    const posts = await ForumPost.find()
      .populate("farmer", "name email")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a comment
router.post("/comment/:postId", isAuth,async (req, res) => {
  try {
    const {  comment } = req.body;
    const { postId } = req.params;
    const userId =req.user._id;

    const post = await ForumPost.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({ user: userId, comment });
    await post.save();

    res.status(200).json({ message: "Comment added", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Like a post
router.post("/like/:postId",isAuth, async (req, res) => {
  try {
    const  userId  = req.user._id;
    const { postId } = req.params;

    const post = await ForumPost.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.likes.includes(userId)) {
      // Already liked — unlike it
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      // Not liked yet — add like
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({ message: "Post liked/unliked", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
