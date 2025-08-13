import mongoose from "mongoose";
import Message from "./message.js";
const conversationSchema = mongoose.Schema({
  Subject: String,
  UpdateAt: {
    type: Date,
    default: new Date(),
  },
  Attendees: [{
    label:String,
    value: String,
  }],
  Messages: [Message],
});
const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;