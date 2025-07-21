import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from "../models/user.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

export const signupService = async ({email, password, firstName, lastName, confirmPassword}) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists.");
  if (password !== confirmPassword) throw new Error("Passwords don't match.");

  const encryptedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    email,
    password: encryptedPassword,
    name: `${firstName} ${lastName}`,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};

export const signinService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User doesn't exist.");

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) throw new Error("Invalid credentials.");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};
export const refreshTokenService = async (refreshToken) => {
    if (!refreshToken) throw new Error("No refresh token provided.");
    
    let decoded;
    try{
        decoded=jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
    }catch(error){
        throw new Error("Invalid refresh token.");
    }

    const user = await User.findById(decoded.id);
    if (!user) throw new Error("User not found.");

    const accessToken = generateAccessToken(user);
    return accessToken;
}