const mongoose = require("mongoose");

// Define the Post Schema
const postSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200, 
    },
    content: {
      type: String,
      required: true,
    },
    tag: {
      type: [String],  // Array of tags
      required: true,
    },
    category: {
      type: [String],  // Array of categories
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,  // Reference to the User model
      ref: "User",  // 'User' is the name of your User model
      required: true,
    },
  },
  {
    timestamps: true,  // Automatically add createdAt and updatedAt fields
  }
);

// Create the Post model
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
