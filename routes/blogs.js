const express = require("express");
const Post = require("../models/post");
const route = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

route.get("/getAllPosts", async (req, res) => {
  const { categories } = req.query;
  try {
    const categoryArray = categories ? categories.split(',') : [];

    const filter = categoryArray.length > 0 ? { category: { $in: categoryArray } } : {};

    const posts = await Post.find(filter);

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.status(200).json({ message: "Posts retrieved successfully", posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

route.post("/createPost", async (req, res) => {
  const { imageUrl, title, content, tag, category, author } = req.body;

  try {
    // Ensure all fields are provided
    if (!imageUrl || !title || !content || !tag || !category || !author) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Verify JWT and extract user info
    const { userId } = jwt.verify(author, process.env.JWT_SECRET);

    if (!userId) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }
    const user = await User.findById(userId); // Fetch the user by ID from the database

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const newPost = new Post({
      imageUrl,
      title,
      content,
      tag,
      category,
      author: userId, // Save the user ID
    });

    await newPost.save();

    res
      .status(201)
      .json({ message: "Post created successfully!", post: newPost });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

route.post("/deletePost", async (req, res) => {
  const { id, author } = req.body;
  try {
    const { userId } = jwt.verify(author, process.env.JWT_SECRET);

    if (!userId) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this post." });
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

route.post("/updatePost", async (req, res) => {
  const { id, author, imageUrl, title, content, tag, category } = req.body;
  try {
    const { userId } = jwt.verify(author, process.env.JWT_SECRET);

    if (!userId) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this post." });
    }

    const updateData = {
      imageUrl: imageUrl || post.imageUrl,
      title: title || post.title,
      content: content || post.content,
      tag: tag || post.tag,
      category: category || post.category,
    };

    await Post.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ message: "Post updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

route.post("/getPostById", async (req, res) => {
  const { id } = req.body; 
  try {
    if (!id) {
      return res.status(400).json({ error: "Post ID is required." });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});



module.exports = route;
