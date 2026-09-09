const { Notification } = require('../models');

/**
 * Create a notification
 */
const createNotification = async (notificationData) => {
  const notification = await Notification.create(notificationData);
  return notification;
};

/**
 * Get user's notifications
 */
const getUserNotifications = async (userId, query = {}) => {
  const { page = 1, limit = 20, unreadOnly } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = { userId };
  if (unreadOnly) filter.isRead = false;

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Notification.countDocuments(filter);

  return {
    data: notifications,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    }
  };
};

/**
 * Get unread notification count
 */
const getUnreadCount = async (userId) => {
  const count = await Notification.countDocuments({
    userId,
    isRead: false,
  });
  return count;
};

/**
 * Mark notification as read
 */
const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({ _id: notificationId, userId });
  if (!notification) {
    throw new Error('Notification not found');
  }

  notification.isRead = true;
  await notification.save();

  return notification;
};

/**
 * Mark all notifications as read
 */
const markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );
  return { modifiedCount: result.modifiedCount };
};

/**
 * Delete notification
 */
const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({ _id: notificationId, userId });
  if (!notification) {
    throw new Error('Notification not found');
  }
  return notification;
};

/**
 * Create notification for donation
 */
const notifyDonation = async (userId, donation) => {
  return createNotification({
    userId,
    type: 'donation',
    title: 'Donation Submitted',
    message: `Your donation of ${donation.amount} ETB has been submitted and is pending verification.`,
    link: '/donations',
    priority: 'medium',
  });
};

/**
 * Create notification for donation verification
 */
const notifyDonationVerified = async (userId, donation) => {
  return createNotification({
    userId,
    type: 'donation',
    title: 'Donation Verified',
    message: `Your donation of ${donation.amount} ETB has been verified. Receipt #${donation.receiptNumber}`,
    link: `/donations/${donation._id}`,
    priority: 'medium',
  });
};

/**
 * Create notification for new event
 */
const notifyNewEvent = async (userId, event) => {
  return createNotification({
    userId,
    type: 'event',
    title: 'New Event',
    message: `${event.title} - ${new Date(event.date).toLocaleDateString()}`,
    link: `/events/${event._id}`,
    priority: 'low',
  });
};

/**
 * Create notification for new blog post
 */
const notifyNewBlog = async (userId, blog) => {
  return createNotification({
    userId,
    type: 'blog',
    title: 'New Blog Post',
    message: blog.title,
    link: `/blog/${blog.slug}`,
    priority: 'low',
  });
};

module.exports = {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  notifyDonation,
  notifyDonationVerified,
  notifyNewEvent,
  notifyNewBlog,
};