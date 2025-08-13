import express from "express";
import { getConversationById,getConversations,createConversation,postMessage } from "../controllers/conversation.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", requireAuth,getConversations);
router.get("/:conversationId", requireAuth, getConversationById);
router.post("/conversation", requireAuth, createConversation);
router.put("/:conversationId/messages", requireAuth, postMessage);

export default router;
