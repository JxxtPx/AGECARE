const cloudinary = require("./cloudinaryConfig");

const uploadToCloudinary = async (file) => {
  const isImage = file.mimetype.startsWith("image/");

  const result = await cloudinary.uploader.upload(file.path, {
    folder: "agedcare/residents",
    use_filename: true,
    unique_filename: false,
    resource_type: isImage ? "image" : "raw",
  });

  if (isImage) {
    // 🖼️ Return direct Cloudinary image URL
    return result.secure_url;
  } else {
    // 📄 Wrap non-images (pdf, docx) for Google Drive Viewer
    return `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(result.secure_url)}`;
  }
};

module.exports = uploadToCloudinary;
