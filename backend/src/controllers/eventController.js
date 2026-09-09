const eventService = require('../services/eventService');

// ============ CREATE EVENT ============
const createEvent = async (req, res) => {
  try {
    // ✅ Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const eventData = {
      ...req.body,
      createdBy: req.user.userId,
    };

    const event = await eventService.createEvent(eventData);
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET ALL EVENTS ============
const getAllEvents = async (req, res) => {
  try {
    const result = await eventService.getAllEvents(req.query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET UPCOMING EVENTS ============
const getUpcomingEvents = async (req, res) => {
  try {
    const events = await eventService.getUpcomingEvents();
    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET EVENT BY ID ============
const getEventById = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.eventId);
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ UPDATE EVENT ============
const updateEvent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const event = await eventService.updateEvent(req.params.eventId, req.body);
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ DELETE EVENT ============
const deleteEvent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    await eventService.deleteEvent(req.params.eventId);
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ UPDATE EVENT STATUSES ============
const updateEventStatuses = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const result = await eventService.updateEventStatuses();
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
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