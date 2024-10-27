import User from "../models/user.model.js";
import jwtk from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: "unathourized" });
    }

    const decoded =  jwtk.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "unathourized: Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "user not found " });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
