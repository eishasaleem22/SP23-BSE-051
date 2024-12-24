const mongoose = require("mongoose");

let productSchema = mongoose.Schema(
  {
    title: String,
    price: Number,
    picture: String,
    description: String,
  },
  { timestamps: true }
);

let ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
