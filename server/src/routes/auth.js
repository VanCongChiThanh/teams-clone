import express from "express";
import {signin,signup,refreshToken,verifyEmail} from "../controllers/auth.controller.js"

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/refresh-token", refreshToken);
router.get("/verify-email", verifyEmail);

export default router;
