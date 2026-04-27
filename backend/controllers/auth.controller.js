import User from '../models/User.model.js';
import { generateToken } from '../utils/generateToken.js';

// Admin registration key - store in environment variable in production
const ADMIN_REGISTRATION_KEY = process.env.ADMIN_REGISTRATION_KEY || 'ADMIN_SECRET_2024';

// @desc    Register new user (Student)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, hostel, room } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      hostel,
      room,
      role: 'student'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hostel: user.hostel,
        room: user.room,
        accountabilityScore: user.accountabilityScore,
        attendanceRate: user.attendanceRate,
        totalBookings: user.totalBookings,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Register new admin
// @route   POST /api/auth/register-admin
// @access  Public (with admin key validation)
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, adminKey, department } = req.body;

    // Validate admin key
    if (!adminKey || adminKey !== ADMIN_REGISTRATION_KEY) {
      return res.status(403).json({ message: 'Invalid or missing admin registration key' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
      department: department || 'Management',
      isActive: true
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        isAdmin: true,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is inactive. Please contact admin.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      hostel: user.hostel,
      room: user.room,
      accountabilityScore: user.accountabilityScore,
      attendanceRate: user.attendanceRate,
      totalBookings: user.totalBookings,
      isAdmin: user.role === 'admin',
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.getPublicProfile());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.hostel = req.body.hostel || user.hostel;
    user.room = req.body.room || user.room;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json(updatedUser.getPublicProfile());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
