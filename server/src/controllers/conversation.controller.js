import { getConversationByIdService,getConversationsService,createConversationService,postMessageService } from "../services/conversation.service.js";
export const getConversations = async (req, res) => {
  const { userName, userId } = req.user;
  try {
    const conversations = await getConversationsService(userName, userId);
    res.status(200).json(conversations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
export const getConversationById = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const conversation = await getConversationByIdService(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    res.status(200).json(conversation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
export const createConversation = async (req, res) => {
    try {
        const newConversation = await createConversationService(req.body);
        res.status(201).json(newConversation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const postMessage = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const updatedConversation = await postMessageService(
      conversationId,
      req.user.id,
      req.body
    );
    res.status(200).json(updatedConversation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}