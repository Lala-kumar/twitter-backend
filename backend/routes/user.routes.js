import express from "express";

import { protectRoute } from "../middleware/protectRoute.js";
import {
  getUserProfile,
  updateUser,
  followUnFollowUser,
  getSuggestedUser,
} from "../controller/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUser);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.post("/update", protectRoute, updateUser);

export default router;
