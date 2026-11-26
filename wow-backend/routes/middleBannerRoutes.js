import express from 'express';
import MiddleBanner from '../models/MiddleBanner.js';

const router = express.Router();

// Fast in-memory caches (~2ms response)
let activeMiddleCache = null;
let adminMiddleCache = null;
const clearMiddleCache = () => {
  activeMiddleCache = null;
  adminMiddleCache = null;
};

// GET active middle banners for User Home page (always fresh from DB)
router.get('/', async (req, res) => {
  try {
    const banners = await MiddleBanner.find({ status: 'active' })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    res.status(200).json({ success: true, banners });
  } catch (err) {
    console.error('Fetch middle banners error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching middle banners' });
  }
});

// GET all middle banners for Admin
router.get('/admin/all', async (req, res) => {
  try {
    if (adminMiddleCache) {
      return res.status(200).json({ success: true, banners: adminMiddleCache });
    }
    const banners = await MiddleBanner.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    adminMiddleCache = banners;
    res.status(200).json({ success: true, banners });
  } catch (err) {
    console.error('Admin fetch middle banners error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching admin middle banners' });
  }
});

// CREATE middle banner (puts new banner at #1)
router.post('/admin', async (req, res) => {
  try {
    const { image, link, title, status } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    await MiddleBanner.updateMany({}, { $inc: { order: 1 } });

    const count = await MiddleBanner.countDocuments();
    const newBanner = new MiddleBanner({
      image,
      link: link || '/',
      title: title || `Middle Banner #${count + 1}`,
      order: 1,
      status: status || 'active'
    });

    await newBanner.save();
    clearMiddleCache();
    res.status(201).json({ success: true, banner: newBanner, message: 'Middle banner uploaded successfully' });
  } catch (err) {
    console.error('Create middle banner error:', err);
    res.status(500).json({ success: false, message: 'Failed to create middle banner' });
  }
});

// REORDER middle banners (PUT /admin/reorder/bulk)
router.put('/admin/reorder/bulk', async (req, res) => {
  try {
    const { items } = req.body;
    if (Array.isArray(items)) {
      await Promise.all(
        items.map((item, idx) =>
          MiddleBanner.findByIdAndUpdate(item.id, { order: item.order ?? idx + 1 })
        )
      );
    }
    clearMiddleCache();
    const banners = await MiddleBanner.find().sort({ order: 1, createdAt: -1 }).lean();
    res.status(200).json({ success: true, banners, message: 'Middle banner order updated' });
  } catch (err) {
    console.error('Reorder middle banners error:', err);
    res.status(500).json({ success: false, message: 'Failed to reorder middle banners' });
  }
});

// UPDATE middle banner (PUT /admin/:id)
router.put('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { image, link, title, status, order } = req.body;

    const banner = await MiddleBanner.findById(id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Middle banner not found' });
    }

    if (image) banner.image = image;
    if (link !== undefined) banner.link = link;
    if (title !== undefined) banner.title = title;
    if (status !== undefined) banner.status = status;
    if (order !== undefined) banner.order = order;

    await banner.save();
    clearMiddleCache();
    res.status(200).json({ success: true, banner, message: 'Middle banner updated successfully' });
  } catch (err) {
    console.error('Update middle banner error:', err);
    res.status(500).json({ success: false, message: 'Failed to update middle banner' });
  }
});

// DELETE middle banner (DELETE /admin/:id)
router.delete('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await MiddleBanner.findByIdAndDelete(id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Middle banner not found' });
    }
    clearMiddleCache();
    res.status(200).json({ success: true, message: 'Middle banner deleted successfully' });
  } catch (err) {
    console.error('Delete middle banner error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete middle banner' });
  }
});

export default router;

