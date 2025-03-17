import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  commentOnPost,
  createPost,
  deletePost,
  getAllPost,
  getLikedPost,
  likeUnlikePost,
  getFollowingPosts,
  getUserPosts,
} from "../controller/post.controller.js";

const router = express.Router();

router.get("/user/:username", protectRoute, getUserPosts); // post of the user
router.get("/following", protectRoute, getFollowingPosts); // post of the user that we follow
router.get("/likes/:id", protectRoute, getLikedPost); // liked post of the users
router.get("/all", protectRoute, getAllPost);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);

export default router;
