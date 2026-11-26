import express from 'express';
import Banner from '../models/Banner.js';

const router = express.Router();

// Fast in-memory cache for instant Home & Admin slider response (~2ms instead of waiting on Atlas)
let activeBannersCache = null;
let adminBannersCache = null;
const clearBannerCache = () => {
  activeBannersCache = null;
  adminBannersCache = null;
};

// GET all active banners for User/Home page (Always fresh & strictly ordered by Admin order)
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find({ status: 'active' }).sort({ order: 1, createdAt: -1 }).lean();
    res.status(200).json({ success: true, banners });
  } catch (err) {
    console.error('Fetch banners error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching banners' });
  }
});

// GET all banners for Admin (both active and inactive, Ordered by order asc, then latest first)
router.get('/admin/all', async (req, res) => {
  try {
    if (adminBannersCache) {
      return res.status(200).json({ success: true, banners: adminBannersCache });
    }
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 }).lean();
    adminBannersCache = banners;
    res.status(200).json({ success: true, banners });
  } catch (err) {
    console.error('Admin fetch banners error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching admin banners' });
  }
});

// CREATE a new banner (POST) - puts new banner at #1 (top priority)
router.post('/admin', async (req, res) => {
  try {
    const { image, link, title, status } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    // Shift existing banners' order down by 1 so the new banner is #1
    await Banner.updateMany({}, { $inc: { order: 1 } });

    const count = await Banner.countDocuments();
    const newBanner = new Banner({
      image,
      link: link || '/',
      title: title || `Banner #${count + 1}`,
      order: 1,
      status: status || 'active'
    });

    await newBanner.save();
    clearBannerCache();
    res.status(201).json({ success: true, banner: newBanner, message: 'Banner uploaded successfully' });
  } catch (err) {
    console.error('Create banner error:', err);
    res.status(500).json({ success: false, message: 'Failed to create banner' });
  }
});

// REORDER banners (PUT /admin/reorder/bulk)
router.put('/admin/reorder/bulk', async (req, res) => {
  try {
    const { items } = req.body; // [{ id, order }]
    if (Array.isArray(items)) {
      await Promise.all(
        items.map((item, idx) =>
          Banner.findByIdAndUpdate(item.id, { order: item.order ?? idx + 1 })
        )
      );
    }
    clearBannerCache();
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, banners, message: 'Order updated' });
  } catch (err) {
    console.error('Reorder banners error:', err);
    res.status(500).json({ success: false, message: 'Failed to reorder banners' });
  }
});

// UPDATE banner (PUT)
router.put('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { image, link, title, status, order } = req.body;

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    if (image) banner.image = image;
    if (link !== undefined) banner.link = link;
    if (title !== undefined) banner.title = title;
    if (status !== undefined) banner.status = status;
    if (order !== undefined) banner.order = order;

    await banner.save();
    clearBannerCache();
    res.status(200).json({ success: true, banner, message: 'Banner updated successfully' });
  } catch (err) {
    console.error('Update banner error:', err);
    res.status(500).json({ success: false, message: 'Failed to update banner' });
  }
});

// DELETE banner (DELETE)
router.delete('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
    clearBannerCache();
    res.status(200).json({ success: true, message: 'Banner deleted successfully' });
  } catch (err) {
    console.error('Delete banner error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete banner' });
  }
});

export default router;

