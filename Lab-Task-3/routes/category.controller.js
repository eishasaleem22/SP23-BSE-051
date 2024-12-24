const express = require("express");
const router = express.Router();
const Category = require("../models/category.model");
const { uploadCategoryImage } = require("../middleware/multer.middleware");
const cloudinary = require("../utils/cloudinary");

// Delete a category
router.get("/admin/category/delete/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    return res.redirect("/admin/categories");
  } catch (err) {
    console.error("Error deleting category:", err);
    return res.status(500).send("Error deleting category: " + err.message);
  }
});

// Render edit form for a category
router.get("/admin/category/editForm/:id", async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);
    return res.render("admin/categoryEdit", {
      layout: "adminlayout",
      category,
    });
  } catch (err) {
    console.error("Error fetching category:", err);
    return res.status(500).send("Error fetching category: " + err.message);
  }
});

// Handle category edit form submission
router.post(
  "/admin/category/editForm/:id",
  uploadCategoryImage.single("categoryPicture"),
  async (req, res) => {
    try {
      let category = await Category.findById(req.params.id);
      category.categoryName = req.body.categoryName;
      category.type = req.body.type;
      category.linkName = req.body.linkName;

      if (req.file) {
        category.imageName = req.file.path;
      }
      await category.save();
      return res.redirect("/admin/categories");
    } catch (err) {
      console.error("Error updating category:", err);
      return res.status(500).send("Error updating category: " + err.message);
    }
  }
);

// Handle new category creation
router.post(
  "/admin/categoryForm",
  uploadCategoryImage.single("categoryPicture"),
  async (req, res) => {
    try {
      const { categoryName, type, linkName } = req.body;
      const imageName = req.file.path;

      if (!categoryName || !type || !linkName || !req.file) {
        return res.status(400).send("All fields and image are required");
      }
      const newCategory = new Category({
        categoryName,
        type,
        linkName,
        imageName,
      });

      await newCategory.save();
      return res.redirect("/admin/categories");
    } catch (err) {
      console.error("Error saving category:", err);
      return res.status(500).send("Error saving category: " + err.message);
    }
  }
);

// Render new category creation form
router.get("/admin/categoryForm", (req, res) => {
  return res.render("admin/categoryForm", {
    layout: "adminlayout",
  });
});

// List all categories
router.get("/admin/categories", async (req, res) => {
  try {
    let categories = await Category.find();
    return res.render("admin/categories", {
      layout: "adminlayout",
      pageTitle: "Manage Categories",
      categories,
    });
  } catch (err) {
    console.error("Error fetching categories:", err);
    return res.status(500).send("Error fetching categories: " + err.message);
  }
});

module.exports = router;
