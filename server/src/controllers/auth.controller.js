import { signupService, signinService } from "../services/auth.service.js";
import { refreshTokenService, verifyEmailService } from "../services/auth.service.js";

export const signup = async (req, res) => {
  try {
    const { message } = await signupService(req.body);
    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const signin = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await signinService(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ result: user, accessToken });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    try {
        const accessToken = await refreshTokenService(token);
        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const { accessToken, refreshToken, user } = await verifyEmailService(token);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Email xác minh thành công, bạn có thể đăng nhập.",
      accessToken,
      user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

