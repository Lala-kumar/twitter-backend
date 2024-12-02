import express from "express";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

cloudinary.config();

const app = express({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json()); // parse req.body
app.use(express.urlencoded({ extended: true })); //parse fromdata
app.use(cookieParser()); //for protectRoutes middleware

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export { app };
