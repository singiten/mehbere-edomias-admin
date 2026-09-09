const { Event } = require('../models');

/**
 * Create an event
 */
const createEvent = async (eventData) => {
  const event = await Event.create(eventData);
  return event;
};

/**
 * Get all events with filters
 */
const getAllEvents = async (query = {}) => {
  const { page = 1, limit = 10, type, status, upcoming } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = {};
  if (type) filter.eventType = type;
  if (status) filter.status = status;
  if (upcoming) {
    filter.date = { $gte: new Date() };
    filter.status = 'upcoming';
  }

  const events = await Event.find(filter)
    .populate('createdBy', '-password')
    .sort({ date: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Event.countDocuments(filter);

  return {
    data: events,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    }
  };
};

/**
 * Get upcoming events
 */
const getUpcomingEvents = async () => {
  const events = await Event.find({
    date: { $gte: new Date() },
    status: 'upcoming',
    isPublic: true,
  })
    .sort({ date: 1 })
    .limit(5);

  return events;
};

/**
 * Get event by ID
 */
const getEventById = async (eventId) => {
  const event = await Event.findById(eventId).populate('createdBy', '-password');
  if (!event) {
    throw new Error('Event not found');
  }
  return event;
};

/**
 * Update event
 */
const updateEvent = async (eventId, updateData) => {
  const event = await Event.findByIdAndUpdate(
    eventId,
    updateData,
    { new: true, runValidators: true }
  ).populate('createdBy', '-password');

  if (!event) {
    throw new Error('Event not found');
  }

  return event;
};

/**
 * Delete event
 */
const deleteEvent = async (eventId) => {
  const event = await Event.findByIdAndDelete(eventId);
  if (!event) {
    throw new Error('Event not found');
  }
  return event;
};

/**
 * Update event status automatically
 */
const updateEventStatuses = async () => {
  const now = new Date();
  
  // Update past events
  await Event.updateMany(
    { date: { $lt: now }, status: 'upcoming' },
    { status: 'past' }
  );

  // Update ongoing events
  await Event.updateMany(
    { 
      date: { $lte: now },
      endDate: { $gte: now },
      status: 'upcoming'
    },
    { status: 'ongoing' }
  );

  return { message: 'Event statuses updated' };
};

module.exports = {
  createEvent,
  getAllEvents,
  getUpcomingEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  updateEventStatuses,
};