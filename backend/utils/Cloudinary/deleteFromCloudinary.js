const cloudinary = require("cloudinary").v2;

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error("Cloudinary deletion failed");
  }
};

module.exports = deleteFromCloudinary;
