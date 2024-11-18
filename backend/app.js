import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json()); // parse req.body
app.use(express.urlencoded({ extended: true })); //parse fromdata
app.use(cookieParser()); //for protectRoutes middleware

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export { app };
