const bcrypt = require('bcryptjs');
const { User, Member } = require('../models');
const { generateToken, generateRandomPassword } = require('../utils/auth');

// ============ ADMIN CREATES MEMBER ============
const createMember = async (userData) => {
  const { fullName, phoneNumber, email, region, subCity, spiritualRole } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ phoneNumber }, { email: email || undefined }],
  });

  if (existingUser) {
    throw new Error('User already exists with this phone or email');
  }

  // Generate temporary password
  const tempPassword = generateRandomPassword();
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  // Create user
  const newUser = await User.create({
    fullName,
    phoneNumber,
    email,
    password: hashedPassword,
    role: 'member',
    isVerified: true,
  });

  // Create member profile
  const member = await Member.create({
    userId: newUser._id,
    region,
    subCity: subCity || null,
    spiritualRole: spiritualRole || 'regular_member',
    membershipStatus: 'active',
  });

  return {
    user: {
      id: newUser._id,
      fullName: newUser.fullName,
      phoneNumber: newUser.phoneNumber,
      email: newUser.email,
      role: newUser.role,
    },
    member,
    tempPassword,
  };
};

// ============ SELF REGISTRATION ============
const register = async (userData) => {
  const { fullName, phoneNumber, email, password } = userData;

  const existingUser = await User.findOne({
    $or: [{ phoneNumber }, { email: email || undefined }],
  });

  if (existingUser) {
    throw new Error('User already exists with this phone or email');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user with visitor role
  const newUser = await User.create({
    fullName,
    phoneNumber,
    email,
    password: hashedPassword,
    role: 'visitor',
    isVerified: true,
  });

  // ✅ AUTO-CREATE MEMBER PROFILE FOR SELF-REGISTERED USERS
  const member = await Member.create({
    userId: newUser._id,
    region: 'Not Specified',
    subCity: null,
    spiritualRole: 'regular_member',
    membershipStatus: 'active',
  });

  console.log(`✅ Auto-created member profile for user: ${newUser.fullName} (${newUser._id})`);

  return {
    id: newUser._id,
    fullName: newUser.fullName,
    phoneNumber: newUser.phoneNumber,
    email: newUser.email,
    role: newUser.role,
    memberId: member._id,
    message: 'Registration successful. Awaiting admin approval.',
  };
};

// ============ LOGIN ============
const login = async (credentials) => {
  const { phoneNumber, email, password } = credentials;

  const user = await User.findOne({
    $or: [{ phoneNumber: phoneNumber || undefined }, { email: email || undefined }],
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

  // ✅ Check if member exists, if not create one
  let member = await Member.findOne({ userId: user._id });
  if (!member) {
    member = await Member.create({
      userId: user._id,
      region: 'Not Specified',
      subCity: null,
      spiritualRole: 'regular_member',
      membershipStatus: 'active',
    });
    console.log(`✅ Auto-created member profile on login for user: ${user.fullName}`);
  }

  const userObj = user.toObject();
  delete userObj.password;

  if (member) {
    userObj.member = member;
  }

  const token = generateToken(user);

  return { user: userObj, token };
};

// ============ GET CURRENT USER ============
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // ✅ Check if member exists, if not create one
  let member = await Member.findOne({ userId: user._id });
  if (!member) {
    member = await Member.create({
      userId: user._id,
      region: 'Not Specified',
      subCity: null,
      spiritualRole: 'regular_member',
      membershipStatus: 'active',
    });
    console.log(`✅ Auto-created member profile for user: ${user.fullName}`);
  }

  const userObj = user.toObject();
  delete userObj.password;

  if (member) {
    userObj.member = member;
  }

  return userObj;
};

// ============ LOGOUT ============
const logout = async () => {
  return { message: 'Logged out successfully' };
};

module.exports = {
  createMember,
  register,
  login,
  logout,
  getCurrentUser,
};