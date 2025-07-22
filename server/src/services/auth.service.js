import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { sendVerificationEmail } from "../utils/email.js";


export const signupService = async ({
  email,
  password,
  firstName,
  lastName,
  confirmPassword,
}) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists.");
  if (password !== confirmPassword) throw new Error("Passwords don't match.");

  const encryptedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    email,
    password: encryptedPassword,
    name: `${firstName} ${lastName}`,
    role: "user",
  });

  const emailToken = jwt.sign({ id: user._id }, process.env.EMAIL_SECRET, {
    expiresIn: "1d",
  });

  const url = `${process.env.CLIENT_URL}/verify-email?token=${emailToken}`;
  await sendVerificationEmail(user.email, url, user.name);

  return {
    message:
      "Signup thành công, vui lòng kiểm tra email để xác minh tài khoản.",
  };
};

export const signinService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User doesn't exist.");
  if (!user.isVerified)
    throw new Error("Email not verified. Please check your inbox.");
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) throw new Error("Invalid credentials.");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};
export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) throw new Error("No refresh token provided.");

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
  } catch (error) {
    throw new Error("Invalid refresh token.");
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new Error("User not found.");

  const accessToken = generateAccessToken(user);
  return accessToken;
};
export const verifyEmailService = async (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.EMAIL_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token.");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new Error("Invalid link.");
  }
  if (user.isVerified) {
    throw new Error("Email đã được xác minh trước đó.");
  }

  user.isVerified = true;
  await user.save();

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { accessToken, refreshToken, user };
};
