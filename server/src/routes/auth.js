import express from "express";
import { signin,signup,refreshToken } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/refresh-token", refreshToken);

export default router;
