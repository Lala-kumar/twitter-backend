import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne(username).select("-password");

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

export const updateUserProfile = async (req, res) => {};
