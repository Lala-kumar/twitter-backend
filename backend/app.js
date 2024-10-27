import express from "express";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json()); // parse req.body
app.use(express.urlencoded({ extended: true })); //parse fromdata
app.use(cookieParser()); //for protectRoutes middleware
app.use("/api/auth", authRoutes);

export { app };
