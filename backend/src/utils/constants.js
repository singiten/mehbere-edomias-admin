/**
 * Application constants
 */

// User Roles
const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MEMBER: 'member',
  VISITOR: 'visitor',
};

// Donation Types
const DONATION_TYPES = {
  TITHE: 'tithe',
  OFFERING: 'offering',
  BUILDING_FUND: 'building_fund',
  SOCIAL_SERVICE: 'social_service',
  GENERAL: 'general',
  OTHER: 'other',
};

// Donation Statuses
const DONATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};

// Event Types
const EVENT_TYPES = {
  LITURGY: 'liturgy',
  FASTING: 'fasting',
  FEAST: 'feast',
  SEMINAR: 'seminar',
  CONFERENCE: 'conference',
  COMMUNITY_SERVICE: 'community_service',
  OTHER: 'other',
};

// Event Statuses
const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  PAST: 'past',
  CANCELLED: 'cancelled',
};

// Blog Categories
const BLOG_CATEGORIES = {
  SPIRITUAL_TEACHING: 'spiritual_teaching',
  ASSOCIATION_NEWS: 'association_news',
  EVENT_RECAP: 'event_recap',
  ANNOUNCEMENT: 'announcement',
};

// Blog Statuses
const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

// Sermon Types
const SERMON_TYPES = {
  VIDEO: 'video',
  AUDIO: 'audio',
  TEXT: 'text',
  PDF: 'pdf',
};

// Membership Statuses
const MEMBERSHIP_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

// Spiritual Roles
const SPIRITUAL_ROLES = {
  PRIEST: 'priest',
  DEACON: 'deacon',
  CHOIR: 'choir',
  YOUTH_LEADER: 'youth_leader',
  ELDER: 'elder',
  REGULAR_MEMBER: 'regular_member',
};

// Notification Types
const NOTIFICATION_TYPES = {
  DONATION: 'donation',
  EVENT: 'event',
  BLOG: 'blog',
  SERMON: 'sermon',
  SYSTEM: 'system',
  ANNOUNCEMENT: 'announcement',
};

// Notification Priorities
const NOTIFICATION_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

module.exports = {
  USER_ROLES,
  DONATION_TYPES,
  DONATION_STATUS,
  EVENT_TYPES,
  EVENT_STATUS,
  BLOG_CATEGORIES,
  BLOG_STATUS,
  SERMON_TYPES,
  MEMBERSHIP_STATUS,
  SPIRITUAL_ROLES,
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITY,
};