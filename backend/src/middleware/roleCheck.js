// ============ ROLE CHECK ============
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  // Check if user role is admin or super_admin
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
      yourRole: req.user.role,
    });
  }

  next();
};

const isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Super Admin privileges required.',
      yourRole: req.user.role,
    });
  }

  next();
};

const isMember = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  // Allow super_admin, admin, and member
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.role !== 'member') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Member privileges required.',
      yourRole: req.user.role,
    });
  }

  next();
};

module.exports = {
  isAdmin,
  isSuperAdmin,
  isMember,
};