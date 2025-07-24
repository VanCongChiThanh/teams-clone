import Conversation from "../models/conversation.js";

export const getConversationsService = async (userName, userId) => {
  const conversations = await Conversation.find({
    "Attendees.label": userName,
    "Attendees.value": userId,
  }).sort({ updatedAt: -1 });
  return conversations;
};
export const getConversationByIdService = async (conversationId) => {
  const conversation = await Conversation.findById(conversationId);
  return conversation;
};

export const postMessageService = async (conversationId, senderId, data) => {
  const { sender, message, timestamp, type, fileName, body } = data;
  const newMessage = {
    senderId: senderId,
    sender: sender,
    message: message,
    timestamp: timestamp,
    type: type,
    fileName: fileName,
    body: body,
  };
  const updatedConversation = await Conversation.findByIdAndUpdate(
    conversationId,
    {
      $push: { Messages: newMessage },
      updatedAt: timestamp,
    },
    { new: true } // trả về document đã update
  );

  return updatedConversation;
};
export const createConversationService = async (data) => {
    const newConversation = new Conversation({...data});
    await newConversation.save();
    return newConversation;
}