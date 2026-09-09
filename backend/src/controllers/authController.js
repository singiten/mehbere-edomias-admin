const authService = require('../services/authService');

// ============ ADMIN CREATES MEMBER ============
const createMember = async (req, res) => {
  try {
    const result = await authService.createMember(req.body);
    return res.status(201).json({
      success: true,
      message: 'Member account created successfully',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ SELF REGISTRATION ============
const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    return res.status(201).json({
      success: true,
      message: result.message || 'Registration successful',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ LOGIN ============
const login = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body);
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user,
      token,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ LOGOUT ============
const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET CURRENT USER ============
const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }
    const user = await authService.getCurrentUser(req.user.userId);
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ EXPORT ALL AUTH FUNCTIONS ============
module.exports = {
  createMember,
  register,
  login,
  logout,
  getCurrentUser,
};