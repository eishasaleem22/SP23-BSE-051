const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");
const { uploadProductImage } = require("../middleware/multer.middleware");
const cloudinary = require("../utils/cloudinary");

// Delete a product
router.get("/admin/products/delete/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  return res.redirect("/admin/products");
});

// Render edit form for a product
router.get("/admin/products/editForm/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  return res.render("admin/editForm", { layout: "adminlayout", product });
});

// Handle product edit form submission
router.post(
  "/admin/products/editForm/:id",
  uploadProductImage.single("picture"),
  async (req, res) => {
    let product = await Product.findById(req.params.id);
    product.title = req.body.title;
    product.description = req.body.description;
    product.price = req.body.price;

    if (req.file) {
      product.picture = req.file.path;
    }

    await product.save();
    return res.redirect("/admin/products");
  }
);

// Handle new product creation
router.post(
  "/admin/createForm",
  uploadProductImage.single("picture"),
  async (req, res) => {
    try {
      const { title, description, price } = req.body;
      const picture = req.file.path;
      const newProduct = new Product({
        title,
        price,
        picture,
        description,
      });
      await newProduct.save();

      return res.redirect("/admin/products");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Error saving product: " + err.message);
    }
  }
);

// Render new product creation form
router.get("/admin/createForm", (req, res) => {
  return res.render("admin/createForm", {
    layout: "adminlayout",
  });
});
module.exports = router;
