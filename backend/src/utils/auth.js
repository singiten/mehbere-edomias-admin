const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// ============ JWT TOKEN GENERATION ============
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// ============ JWT TOKEN VERIFICATION ============
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// ============ GENERATE RANDOM PASSWORD ============
const generateRandomPassword = () => {
  const length = 10;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// ============ GENERATE MEMBERSHIP ID ============
const generateMembershipId = async (Member) => {
  const year = new Date().getFullYear();
  const count = await Member.countDocuments() + 1;
  return `ME-${year}-${String(count).padStart(4, '0')}`;
};

module.exports = {
  generateToken,
  verifyToken,
  generateRandomPassword,
  generateMembershipId,
};