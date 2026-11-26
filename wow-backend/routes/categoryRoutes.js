import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// Fast in-memory caches for instant Home & Admin category loading (~2ms)
let activeCategoriesCache = null;
let adminCategoriesCache = null;
const clearCategoryCache = () => {
  activeCategoriesCache = null;
  adminCategoriesCache = null;
};

// GET all active categories for User Home page (Always fresh & strictly ordered by Admin order)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ status: 'active' }).sort({ order: 1, createdAt: -1 }).lean();
    res.status(200).json({ success: true, categories });
  } catch (err) {
    console.error('Fetch categories error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching categories' });
  }
});

// GET all categories for Admin (both active and inactive, Ordered by order asc, then latest first)
router.get('/admin/all', async (req, res) => {
  try {
    if (adminCategoriesCache) {
      return res.status(200).json({ success: true, categories: adminCategoriesCache });
    }
    const categories = await Category.find().sort({ order: 1, createdAt: -1 }).lean();
    adminCategoriesCache = categories;
    res.status(200).json({ success: true, categories });
  } catch (err) {
    console.error('Admin fetch categories error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching admin categories' });
  }
});

// CREATE a new category (POST) - puts new category at #1 (top priority)
router.post('/admin', async (req, res) => {
  try {
    const { name, image, path, status } = req.body;
    if (!name || !image) {
      return res.status(400).json({ success: false, message: 'Category name and icon image are required' });
    }

    // Shift existing categories' order down by 1 so the new category is #1
    await Category.updateMany({}, { $inc: { order: 1 } });

    const newCategory = new Category({
      name: name.trim(),
      image,
      path: path || `/${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      order: 1,
      status: status || 'active'
    });

    await newCategory.save();
    clearCategoryCache();
    res.status(201).json({ success: true, category: newCategory, message: 'Category added successfully' });
  } catch (err) {
    console.error('Create category error:', err);
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
});

// REORDER categories (PUT /admin/reorder/bulk)
router.put('/admin/reorder/bulk', async (req, res) => {
  try {
    const { items } = req.body; // [{ id, order }]
    if (Array.isArray(items)) {
      await Promise.all(
        items.map((item, idx) =>
          Category.findByIdAndUpdate(item.id, { order: item.order ?? idx + 1 })
        )
      );
    }
    clearCategoryCache();
    const categories = await Category.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, categories, message: 'Category order updated' });
  } catch (err) {
    console.error('Reorder categories error:', err);
    res.status(500).json({ success: false, message: 'Failed to reorder categories' });
  }
});

// UPDATE category (PUT /admin/:id)
router.put('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, path, status, order } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (name !== undefined) category.name = name.trim();
    if (image) category.image = image;
    if (path !== undefined) category.path = path;
    if (status !== undefined) category.status = status;
    if (order !== undefined) category.order = order;

    await category.save();
    clearCategoryCache();
    res.status(200).json({ success: true, category, message: 'Category updated successfully' });
  } catch (err) {
    console.error('Update category error:', err);
    res.status(500).json({ success: false, message: 'Failed to update category' });
  }
});

// DELETE category (DELETE /admin/:id)
router.delete('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    clearCategoryCache();
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
});

export default router;

