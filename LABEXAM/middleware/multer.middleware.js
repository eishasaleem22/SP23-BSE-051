const multer = require("multer");
const { createCloudinaryStorage } = require("../utils/cloudinary");

const productImageStorage = createCloudinaryStorage({
  folder: "picture",
  resourceType: "image",
  format: async (req, file) => {
    const mimeType = file.mimetype.split("/")[1];
    const allowedFormats = ["jpeg", "png", "jpg", "gif"];
    return allowedFormats.includes(mimeType) ? mimeType : "jpeg";
  },
  publicId: (req, file) => `${Date.now()}_${file.originalname}`,
});

const categoryImageStorage = createCloudinaryStorage({
  folder: "categoryPicture",
  resourceType: "image",
  format: async (req, file) => {
    const mimeType = file.mimetype.split("/")[1];
    const allowedFormats = ["jpeg", "png", "jpg", "gif"];
    return allowedFormats.includes(mimeType) ? mimeType : "jpeg";
  },
  publicId: (req, file) => `${Date.now()}_${file.originalname}`,
});

const uploadCategoryImage = multer({ storage: categoryImageStorage });
const uploadProductImage = multer({ storage: productImageStorage });

module.exports = {
  uploadCategoryImage,
  uploadProductImage,
};
