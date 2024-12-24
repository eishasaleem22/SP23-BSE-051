const express = require("express");
let router = express.Router();
let Product = require("../models/product.model");
let adminMiddleware = require("../middleware/admin.middleware");
let authMiddleware = require("../middleware/auth.middleware");

router.get("/admin/products/:page?", adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const pageSize = 3;

    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";
    const category = req.query.category || "";
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Infinity;

    const searchQuery = {
      title: { $regex: search, $options: "i" },
      price: { $gte: minPrice, $lte: maxPrice },
    };

    if (category) {
      searchQuery.category = category;
    }

    const sortQuery = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const totalRecords = await Product.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalRecords / pageSize);

    const products = await Product.find(searchQuery)
      .sort(sortQuery)
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    return res.render("admin/products", {
      layout: "adminlayout",
      pageTitle: "Manage Your Products",
      products,
      page,
      pageSize,
      totalPages,
      totalRecords,
      search,
      sortBy,
      sortOrder,
      category,
      minPrice,
      maxPrice,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).render("error", {
      layout: "adminlayout",
      message: "Error fetching products",
      error: error,
    });
  }
});

router.get("/admin/user-products/:page?", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const pageSize = 3;

    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";
    const category = req.query.category || "";
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Infinity;

    const searchQuery = {
      title: { $regex: search, $options: "i" },
      price: { $gte: minPrice, $lte: maxPrice },
    };

    if (category) {
      searchQuery.category = category;
    }

    const sortQuery = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const totalRecords = await Product.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalRecords / pageSize);

    const products = await Product.find(searchQuery)
      .sort(sortQuery)
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    return res.render("admin/user-products", {
      pageTitle: "See All Products",
      products,
      page,
      pageSize,
      totalPages,
      totalRecords,
      search,
      sortBy,
      sortOrder,
      category,
      minPrice,
      maxPrice,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).render("error", {
      message: "Error fetching products",
      error: error,
    });
  }
});

module.exports = router;
