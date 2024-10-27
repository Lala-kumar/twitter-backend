import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateTokenAndSendCookie from "../utils/generateTokenAndSendCookie.js";

export const login = async (req, res) => {
  // all field required
  // check username in db
  // match password
  const { username, password } = req.body;

  try {
    if (!username) {
      return res.status(400).json({ error: "username required" });
    }
    if (!password) {
      return res.status(400).json({ error: "password required" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const pass = await bcryptjs.compare(password, user?.password || "");

    if (!pass) {
      return res.status(400).json({ error: "Wrong password" });
    }

    generateTokenAndSendCookie(user._id, res);

    res.status(201).json({
      _id: user._id,
      email: user.email,
      password: user.password,
      username: user.username,
      fullName: user.fullName,
      coverImg: user.coverImg,
      profileImg: user.profileImg,
    });
  } catch (error) {
    console.log("Error in login", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({
      message: "Logout successfully",
    });
  } catch (error) {
    console.log("Error in logout", error.message);

    return res.status(500).json({ error: "Internal server error" });
  }
};

export const signup = async (req, res) => {
  //all filed required
  //if username exist
  //if email exist
  //hash password
  const { fullName, username, email, password } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: "Invalid email!" });
    }

    if (!fullName) {
      return res.status(400).json({ error: "FullName is required!" });
    }

    if (!password) {
      return res.status(400).json({ error: "Password is required!" });
    }
    if (!username) {
      return res.status(400).json({ error: "Username is required!" });
    }

    const existedUser = await User.findOne({ username });
    if (existedUser) {
      return res.status(400).json({ error: "Username aalready exist" });
    }

    const existedEmail = await User.findOne({ email });
    if (existedEmail) {
      return res.status(400).json({ error: "Email already exist" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be 6 character long" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      username,
    });

    if (newUser) {
      generateTokenAndSendCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        password: newUser.password,
        fullName: newUser.fullName,
        username: newUser.username,
        coverImg: newUser.coverImg,
        profileImg: newUser.profileImg,
      });
    } else {
      return res.status(400).json({ error: "Invalid User Data" });
    }
  } catch (error) {
    console.log("Error in signup", error.message);

    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe", error.message).select("-password");
    return res.status(500).json({ error: "Internal server error" });
  }
};
