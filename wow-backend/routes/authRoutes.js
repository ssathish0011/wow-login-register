import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// REGISTER API: POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: 'Name is required (at least 2 characters).' });
    }

    const cleanPhone = (phone || '').trim().replace(/\D/g, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({ message: 'Please provide a valid 10-digit Indian mobile number.' });
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email: cleanEmail }, { phone: cleanPhone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this Email or Phone already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      name: name.trim(),
      phone: cleanPhone,
      email: cleanEmail,
      password: hashedPassword,
      role: role || 'user',
    });

    await newUser.save();

    // Create JWT Token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || 'secretkey123',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful!',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        role: newUser.role,
      }
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// LOGIN API: POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email OR phone

    // Find by email or phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials! User not found.' });
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials! Wrong password.' });
    }

    // Create JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secretkey123',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ADMIN LOGIN API: POST /api/auth/admin-login
router.post('/admin-login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Check if any admin exists; if not, seed default admin
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@wow123', salt);
      const defaultAdmin = new User({
        name: 'WOW Super Admin',
        phone: '9999999999',
        email: 'admin@wowapp.com',
        password: hashedPassword,
        role: 'admin',
      });
      await defaultAdmin.save();
      console.log('🛡️ [ADMIN SEED] Default Super Admin created: admin@wowapp.com / Admin@wow123');
    }

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please enter admin username/email and password.' });
    }

    // Find admin user
    const user = await User.findOne({
      $or: [{ email: identifier.trim() }, { phone: identifier.trim() }]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid Admin Credentials! User not found.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied! You do not have administrator permissions.' });
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Admin Credentials! Wrong password.' });
    }

    // Create Admin JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'supersecretwowkey123',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Admin authorization successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
});

export default router;