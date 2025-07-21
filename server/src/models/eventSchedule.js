import mongoose from "mongoose";
import Message from "./message.js";
const eventSchema = mongoose.Schema({
    Subject: String,
    IsAllDay: Boolean,
    StartTime:{
        type: Date,
        default: new Date(),
    },
    EndTime: {
        type: Date,
        default: new Date(),
    },
    UpdateAt: {
        type: Date,
        default: new Date(),
    },
    Description: String,
    MeetingId: String,
    Attendees: [String],
    Creator: String,
    CreatorId: String,
    Messages: [Message],
});

const EventSchedule = mongoose.model("EventSchedule", eventSchema);
export default EventSchedule;