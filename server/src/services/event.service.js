import EventSchedule from "../models/eventSchedule.js";

export const getEventByIdService = async (eventId) => {
  const event = await EventSchedule.findById(id);
  return event;
};

export const getEventByCreatorIdDateService = async (creatorId, date) => {
  const event = await EventSchedule.findOne({
    $and: [{ StartTime: new Date(date) }, { CreatorId: creatorId }],
  });
  return event;
};

export const getEventsService = async (userId, userName) => {
  const eventSchedules = await EventSchedule.find({
    $or: [{ CreatorId: userId }, { Attendees: userName + "," + userId }],
  })
    .select({ Messages: { $slice: -1 } })
    .sort({ UpdatedAt: -1 });

  return eventSchedules;
};

export const createEventService = async (userId, eventData) => {
  const newEvent = new EventSchedule({
    ...eventData,
    CreatorId: userId,
  });
  await newEvent.save();
  return newEvent;
};

export const updateEventService = async (eventId, eventData) => {
  const updatedEvent = await EventSchedule.findByIdAndUpdate(
    eventId,
    eventData,
    { new: true }
  );
  return updatedEvent;
};

export const updateEventByCreatorIdDateService = async (creatorId, date, eventData) => {
  const updatedEvent = await EventSchedule.findOneAndUpdate(
    { CreatorId: creatorId, StartTime: new Date(date) },
    eventData,
    { new: true }
  );
  return updatedEvent;
};
export const deleteEventService = async (eventId) => {
  await EventSchedule.findByIdAndRemove(eventId);
};

export const deleteEventByCreatorIdDateService = async (creatorId, date) => {
  await EventSchedule.findOneAndDelete({
    CreatorId: creatorId,
    StartTime: new Date(date),
  });
};


export const messageEventService = async (roomId, userId, messageData) => {
  const event = await EventSchedule.findById(roomId);
  if (!event) throw new Error("Event not found.");

  event.Messages.push({
    senderId: userId,
    sender: messageData.sender,
    message: messageData.message,
    timestamp: messageData.timestamp,
    type: messageData.type,
    fileName: messageData.fileName,
    body: messageData.body,
  });
  event.UpdatedAt = messageData.timestamp;

  const updatedEvent = await EventSchedule.findByIdAndUpdate(roomId, event, {
    new: true,
  });
  return updatedEvent;
};