import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// In-memory OTP store: phone -> { otp, expiresAt }
const otpStore = new Map();

// SEND OTP API: POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const cleanPhone = (req.body.phone || '').trim().replace(/\D/g, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({ message: 'Please provide a valid 10-digit Indian mobile number.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(cleanPhone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    console.log(`[OTP] Mobile: ${cleanPhone} | OTP: ${otp}`);

    res.status(200).json({
      message: 'OTP sent successfully!',
      devOtp: otp, // Returned for dev/testing; remove in production when SMS gateway is connected
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ message: 'Server error while sending OTP' });
  }
});

// VERIFY OTP API: POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const cleanPhone = (req.body.phone || '').trim().replace(/\D/g, '');
    const otp = (req.body.otp || '').trim();
    const name = (req.body.name || '').trim();

    const record = otpStore.get(cleanPhone);
    if (!record) {
      return res.status(400).json({ message: 'OTP not found or expired. Please request a new OTP.' });
    }
    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanPhone);
      return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
    }
    if (record.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    otpStore.delete(cleanPhone);

    let user = await User.findOne({ phone: cleanPhone });
    if (!user) {
      user = new User({
        name: name.length >= 2 ? name : 'WOW User',
        phone: cleanPhone,
        role: 'user',
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secretkey123',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'OTP verified successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email || '',
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ message: 'Server error while verifying OTP' });
  }
});

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

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please enter admin username/email and password.' });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Check if the target admin exists (by email or phone)
    let user = await User.findOne({
      $or: [{ email: cleanIdentifier }, { phone: identifier.trim() }]
    });

    // If default admin does not exist yet or doesn't have admin role, auto-upsert default super admin
    if (!user && cleanIdentifier === 'admin@wowapp.com') {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@wow123', salt);
      user = new User({
        name: 'WOW Super Admin',
        phone: '9999999999',
        email: 'admin@wowapp.com',
        password: hashedPassword,
        role: 'admin',
      });
      await user.save();
      console.log('🛡️ [ADMIN SEED] Default Super Admin created: admin@wowapp.com / Admin@wow123');
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid Admin Credentials! User not found.' });
    }

    // If user exists as admin@wowapp.com but role is not admin, promote to admin
    if (user.email === 'admin@wowapp.com' && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied! You do not have administrator permissions.' });
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    
    // If password mismatch for default admin, reset to default password
    if (!isMatch && cleanIdentifier === 'admin@wowapp.com' && password === 'Admin@wow123') {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash('Admin@wow123', salt);
      await user.save();
    } else if (!isMatch) {
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