const Category = require('../models/Category');

const categoryController = {
  // Get all categories
  async getCategories(req, res) {
    try {
      const categories = await Category.find().sort('name');
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
  },

  // Get single category
  async getCategory(req, res) {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching category', error: error.message });
    }
  },

  // Create new category (admin only)
  async createCategory(req, res) {
    try {
      const { name, description, iconName, colorClass } = req.body;
      const slug = name.toLowerCase().replace(/ /g, '-');

      const category = new Category({
        name,
        slug,
        description,
        iconName,
        colorClass,
      });

      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: 'Error creating category', error: error.message });
    }
  },

  // Update category (admin only)
  async updateCategory(req, res) {
    try {
      const { name, description, iconName, colorClass } = req.body;
      const slug = name?.toLowerCase().replace(/ /g, '-');

      const category = await Category.findByIdAndUpdate(
        req.params.id,
        { name, slug, description, iconName, colorClass },
        { new: true }
      );

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.json(category);
    } catch (error) {
      res.status(500).json({ message: 'Error updating category', error: error.message });
    }
  },

  // Delete category (admin only)
  async deleteCategory(req, res) {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
  },
};

module.exports = categoryController; 