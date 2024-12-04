import User from "../models/user.model.js";
import Post from "../models/post.model.js";
// import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;

    const userId = req.user._id.toString();

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "user not found!" });
    }

    if (!text && !img) {
      return res.status(400).json({ error: "Post must have text or image!" });
    }

    // if (img) {
    //   const response = await cloudinary.uploader.upload(img);
    //   img = response.secure_url;
    // }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log("Create Post", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const commentOnPost = async (req, res) => {};
export const likeUnlikePost = async (req, res) => {};
export const deletePost = async (req, res) => {};
