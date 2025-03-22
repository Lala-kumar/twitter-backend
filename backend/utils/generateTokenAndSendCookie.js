import jwt from "jsonwebtoken";

const generateTokenAndSendCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true, // xss attack
    sameSite: "none",
    secure: false,
  });
};

export default generateTokenAndSendCookie;
