import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: 30 * 24 * 60 * 60, // 30 days
  });
};