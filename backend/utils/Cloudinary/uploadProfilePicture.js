const cloudinary = require("./cloudinaryConfig");

const uploadProfilePicture = async (file) => {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: "agedcare/profiles", // ✅ new folder
    use_filename: true,
    unique_filename: false,
    resource_type: "raw",
  });

  return result.secure_url;

};

module.exports = uploadProfilePicture;
