const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },
    imageName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Bedroom", "Living Room", "Home office", "Dining Room", "Home"],
      required: true,
    },
    linkName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
