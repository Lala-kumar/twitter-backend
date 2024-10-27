import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();

import { login, signup, logout, getMe } from "../controller/auth.controller.js";

router.get("/me", protectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
