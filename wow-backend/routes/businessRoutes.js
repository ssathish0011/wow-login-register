import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Business from '../models/Business.js';
import User from '../models/User.js';
import { verifyToken, optionalToken } from '../middleware/authMiddleware.js';
import { MASTER_CATEGORIES, MASTER_PACKAGES } from '../constants/categoriesCatalog.js';

const router = express.Router();

// GET CATEGORIES CATALOG & AUTOCOMPLETE: GET /api/business/categories
router.get('/categories', async (req, res) => {
  try {
    const { search } = req.query;
    if (!search || !search.trim()) {
      return res.status(200).json({
        success: true,
        count: MASTER_CATEGORIES.length,
        categories: MASTER_CATEGORIES
      });
    }

    const cleanQ = search.trim().toLowerCase();
    const matches = [];

    MASTER_CATEGORIES.forEach(cat => {
      // Check main category match
      if (cat.name.toLowerCase().includes(cleanQ)) {
        matches.push({
          type: 'main',
          mainCategory: cat.name,
          name: cat.name,
          icon: cat.icon
        });
      }

      // Check subcategory matches
      cat.subCategories.forEach(sub => {
        if (sub.toLowerCase().includes(cleanQ)) {
          matches.push({
            type: 'sub',
            mainCategory: cat.name,
            name: sub,
            icon: cat.icon
          });
        }
      });
    });

    res.status(200).json({
      success: true,
      query: search,
      count: matches.length,
      results: matches.slice(0, 20)
    });
  } catch (error) {
    console.error('Fetch Categories Error:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// GET LISTING PACKAGES: GET /api/business/packages
router.get('/packages', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: MASTER_PACKAGES.length,
      packages: MASTER_PACKAGES
    });
  } catch (error) {
    console.error('Fetch Packages Error:', error);
    res.status(500).json({ message: 'Failed to fetch packages' });
  }
});

// REGISTER BUSINESS: POST /api/business/register
// Uses optionalToken: Works whether user is logged in or registering for the first time!
router.post('/register', optionalToken, async (req, res) => {
  try {
    const {
      businessName,
      contactPerson,
      phone,
      whatsapp,
      email,
      yearEstablished,
      category,
      subCategory,
      description,
      address,
      city,
      pincode,
      landmark,
      timing,
      paymentMethods,
      images,
      videoUrl,
      package: selectedPackage,
      packagePrice,
      paymentStatus,
      paymentTransactionId
    } = req.body;

    console.log('👉 [REGISTER ATTEMPT] Business:', businessName, '| Phone:', phone, '| User ID:', req.userId);

    if (!businessName || !contactPerson || !phone || !category || !address || !city || !pincode) {
      return res.status(400).json({ message: 'Please fill in all required fields (Name, Phone, Category, Address, City, Pincode).' });
    }

    const cleanPhone = (phone || '').trim().replace(/\D/g, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({ message: 'Invalid phone number. Must be a 10-digit Indian mobile number.' });
    }

    const cleanPincode = (pincode || '').trim().replace(/\D/g, '');
    if (cleanPincode.length !== 6) {
      return res.status(400).json({ message: 'Invalid pincode. Pincode must be exactly 6 digits.' });
    }

    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ message: 'Invalid email address format.' });
      }
    }

    let ownerId = req.userId;
    let authUser = null;
    let token = null;

    // 1. If user is already authenticated via Token
    if (ownerId) {
      authUser = await User.findById(ownerId);
      if (authUser) {
        authUser.role = 'business_owner';
        await authUser.save();
      }
    }

    // 2. If NOT authenticated, check if user exists by Phone or Email
    if (!ownerId) {
      const cleanPhone = phone.trim();
      const cleanEmail = email ? email.trim() : `${cleanPhone}@wowapp.com`;

      let existingUser = await User.findOne({
        $or: [{ phone: cleanPhone }, { email: cleanEmail }]
      });

      if (existingUser) {
        ownerId = existingUser._id;
        existingUser.role = 'business_owner';
        await existingUser.save();
        authUser = existingUser;
      } else {
        // Auto-create new user account for the business owner
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(cleanPhone, salt); // Default password is their phone number

        const newUser = new User({
          name: contactPerson.trim(),
          phone: cleanPhone,
          email: cleanEmail,
          password: hashedPassword,
          role: 'business_owner',
        });

        await newUser.save();
        ownerId = newUser._id;
        authUser = newUser;
      }

      // Generate JWT Token so user is immediately logged in
      token = jwt.sign(
        { id: authUser._id, role: authUser.role },
        process.env.JWT_SECRET || 'supersecretwowkey123',
        { expiresIn: '30d' }
      );
    }

    // 3. Create and Save Business Listing into MongoDB
    const newBusiness = new Business({
      ownerId: ownerId,
      businessName: businessName.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp ? whatsapp.trim() : phone.trim(),
      email: email ? email.trim() : '',
      yearEstablished: yearEstablished || '2023',
      category: category,
      subCategory: subCategory ? subCategory.trim() : '',
      description: description ? description.trim() : '',
      address: address.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
      landmark: landmark ? landmark.trim() : '',
      timing: timing || {
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        openTime: '09:00 AM',
        closeTime: '09:00 PM'
      },
      paymentMethods: paymentMethods || ['Cash', 'UPI / GPay'],
      images: Array.isArray(images) ? images : [],
      videoUrl: videoUrl ? videoUrl.trim() : '',
      package: selectedPackage || 'Silver',
      packagePrice: packagePrice || 0,
      paymentStatus: paymentStatus || (selectedPackage === 'Silver' ? 'free' : 'paid'),
      paymentTransactionId: paymentTransactionId || '',
      status: 'pending_approval', // Admin will approve it!
      verified: false             // Not verified until admin review
    });

    const savedBusiness = await newBusiness.save();
    console.log('✅ [SUCCESS] Business stored in MongoDB with ID:', savedBusiness._id);

    res.status(201).json({
      message: 'Business submitted successfully! Pending admin verification.',
      business: savedBusiness,
      token: token || undefined,
      user: authUser ? {
        id: authUser._id,
        name: authUser.name,
        phone: authUser.phone,
        email: authUser.email,
        role: authUser.role,
      } : undefined
    });
  } catch (error) {
    console.error('❌ [ERROR] Business Register Error:', error);
    res.status(500).json({ message: 'Server error while registering business: ' + (error.message || '') });
  }
});

// GET USER'S REGISTERED BUSINESSES: GET /api/business/my-listings
// Supports both token and phone query fallback
router.get('/my-listings', optionalToken, async (req, res) => {
  try {
    let query = {};
    if (req.userId) {
      query.ownerId = req.userId;
    } else if (req.query.phone) {
      const cleanPhone = String(req.query.phone).trim();
      const user = await User.findOne({ phone: cleanPhone });
      if (user) {
        query.ownerId = user._id;
      } else {
        query.phone = cleanPhone;
      }
    } else {
      return res.status(200).json({ businesses: [] });
    }

    const businesses = await Business.find(query).sort({ createdAt: -1 });
    res.status(200).json({ businesses });
  } catch (error) {
    console.error('Fetch My Businesses Error:', error);
    res.status(500).json({ message: 'Failed to fetch business listings' });
  }
});

// ADMIN: GET DASHBOARD STATS
router.get('/admin/stats', verifyToken, async (req, res) => {
  try {
    const pendingCount = await Business.countDocuments({ status: 'pending_approval' });
    const activeCount = await Business.countDocuments({ status: 'active' });
    const totalCount = await Business.countDocuments({});
    const usersCount = await User.countDocuments({});
    
    const paidBusinesses = await Business.find({ paymentStatus: 'paid' }, 'packagePrice');
    const totalRevenue = paidBusinesses.reduce((acc, curr) => acc + (curr.packagePrice || 0), 0);

    res.status(200).json({
      stats: {
        pendingCount,
        activeCount,
        totalCount,
        usersCount,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
});

// ADMIN: GET ALL LISTINGS (Active, Pending, All)
router.get('/admin/all', verifyToken, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    const businesses = await Business.find(query)
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });
    res.status(200).json({ businesses });
  } catch (error) {
    console.error('Fetch Admin All Error:', error);
    res.status(500).json({ message: 'Failed to fetch listings' });
  }
});

// ADMIN: GET ALL PENDING LISTINGS (Waiting for approval)
router.get('/admin/pending', verifyToken, async (req, res) => {
  try {
    const pendingListings = await Business.find({ status: 'pending_approval' })
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });
    res.status(200).json({ businesses: pendingListings });
  } catch (error) {
    console.error('Fetch Pending Error:', error);
    res.status(500).json({ message: 'Failed to fetch pending listings' });
  }
});

// ADMIN: APPROVE BUSINESS AND GRANT VERIFIED BADGE
router.put('/admin/approve/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { verified = true, adminNotes } = req.body;

    const updated = await Business.findByIdAndUpdate(
      id,
      {
        status: 'active',
        verified: verified,
        adminApprovedAt: new Date(),
        adminNotes: adminNotes || 'Approved by administrator'
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.status(200).json({
      message: 'Business approved and verified successfully!',
      business: updated
    });
  } catch (error) {
    console.error('Approve Error:', error);
    res.status(500).json({ message: 'Server error while approving business' });
  }
});

// ADMIN: REJECT BUSINESS
router.put('/admin/reject/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const updated = await Business.findByIdAndUpdate(
      id,
      {
        status: 'rejected',
        verified: false,
        adminNotes: reason || 'Details did not meet verification criteria'
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.status(200).json({ message: 'Business rejected', business: updated });
  } catch (error) {
    console.error('Reject Error:', error);
    res.status(500).json({ message: 'Server error while rejecting business' });
  }
});

// PUBLIC: GET ALL ACTIVE BUSINESSES (Only approved listings show up in search/category)
router.get('/all', async (req, res) => {
  try {
    const { category, city, search, package: pkg } = req.query;
    let query = { status: 'active' };

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    if (pkg) {
      query.package = pkg;
    }
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { subCategory: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const businesses = await Business.find(query)
      .sort({ package: -1, verified: -1, createdAt: -1 });

    res.status(200).json({ businesses });
  } catch (error) {
    console.error('Fetch All Businesses Error:', error);
    res.status(500).json({ message: 'Failed to fetch businesses' });
  }
});

export default router;
