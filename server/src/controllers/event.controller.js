import {
  getEventByIdService,
  getEventByCreatorIdDateService,
  getEventsService,
  createEventService,
  updateEventService,
  updateEventByCreatorIdDateService,
  deleteEventService,
  deleteEventByCreatorIdDateService,
  messageEventService,
} from "../services/event.service.js";


export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await getEventByIdService(id);
    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventByCreatorIdDate = async (req, res) => {
  try {
    const { date } = req.params;
    const event = await getEventByCreatorIdDateService(req.userId, date);
    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await getEventsService(req.userId, req.userName);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    const newEvent = await createEventService(req.userId, eventData);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const eventData = req.body;
    const updatedEvent = await updateEventService(id, eventData);
    if (!updatedEvent)
      return res.status(404).json({ message: "Event not found." });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEventByCreatorIdDate = async (req, res) => {
  try {
    const { date } = req.params;
    const eventData = req.body;
    const updatedEvent = await updateEventByCreatorIdDateService(
      req.userId,
      date,
      eventData
    );
    if (!updatedEvent)
      return res.status(404).json({ message: "Event not found." });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteEventService(id);
    res.json({ message: "Event deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEventByCreatorIdDate = async (req, res) => {
  try {
    const { date } = req.params;
    await deleteEventByCreatorIdDateService(req.userId, date);
    res.json({ message: "Event deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const messageEvent = async (req, res) => {
  try {
    const { id: roomId } = req.params;
    const messageData = req.body;
    const updatedEvent = await messageEventService(
      roomId,
      req.userId,
      messageData
    );
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
