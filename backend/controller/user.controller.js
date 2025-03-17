import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");

    if (!user) return res.status(404).json({ error: "user not found!" });

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getting user profile", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id).select("-password");
    const currentUser = await User.findById(req.user._id).select("-password");

    if (!userToModify || !currentUser) {
      return res.status(404).json({ error: "user not found!" });
    }

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "you can't follow unfollow yourself!" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      //unfollow user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ messsage: "Unfollow successfully!" });
    } else {
      //follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      //send notification to the user
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: id,
      });

      await newNotification.save();

      res.status(200).json({ messsage: "User Followed successfully!" });
    }
  } catch (error) {
    console.log("Error in followUnFollowUser user profile", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      }, //for remover 10 requested user from 10 returned user
      { $sample: { size: 10 } }, //return 10 user
    ]);

    const filteredUser = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );

    const suggestedUser = filteredUser.slice(0, 4);

    suggestedUser.forEach((user) => (user.password = null));
    res.status(200).json(suggestedUser);
  } catch (error) {
    console.log("Suggested user", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;

  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;

  try {
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "user not found!" });
    }

    // update password
    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({ error: "please provide both password" });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch || newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "current password is not valid! or length is short" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "length is short" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // update profile image
    if (profileImg) {
      //delete old img
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }

      const response = await cloudinary.uploader.upload(profileImg);
      profileImg = response.secure_url;
    }

    // update cover image
    if (coverImg) {
      //delete old img
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }

      const response = await cloudinary.uploader.upload(coverImg);
      coverImg = response.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();
    user.password = null;

    return res.status(200).json(user);
  } catch (error) {
    console.log("Update User", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
