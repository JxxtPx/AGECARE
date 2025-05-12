const Resident = require("../../models/Resident");
const uploadToCloudinary = require("../../utils/Cloudinary/uploadToCloudinary");

// ✅ GET all residents
exports.getAllResidents = async (req, res) => {
  const residents = await Resident.find();
  res.json(residents);
};

// ✅ POST create new resident
exports.createResident = async (req, res) => {
  try {
    const {
      fullName,
      gender,
      dateOfBirth,
      roomNumber,
      user,
      allergies,
      dietaryPreferences,
      isActive,
      photo,
      contactInfo,
      emergencyContacts,
      medicalConditions,
      medicalHistory, // ✅ Add this field
    } = req.body;

    const newResident = new Resident({
      fullName,
      gender,
      dateOfBirth,
      roomNumber,
      user,
      allergies,
      dietaryPreferences,
      isActive,
      photo,
      contactInfo,
      emergencyContacts,
      medicalConditions,
      medicalHistory, // ✅ Save if provided
    });

    const savedResident = await newResident.save();

    res.status(201).json({
      message: "Resident created successfully",
      resident: savedResident,
    });
  } catch (error) {
    console.error("Error creating resident:", error);
    res.status(500).json({ message: "Failed to create resident" });
  }
};


// ✅ PUT update resident
// exports.updateResident = async (req, res) => {
//   const { id } = req.params;
//   const updatedResident = await Resident.findByIdAndUpdate(id, req.body, { new: true });

//   if (!updatedResident) {
//     res.status(404);
//     throw new Error("Resident not found");
//   }

//   res.json({ message: "Resident updated successfully", resident: updatedResident });
// };


exports.updateResident = async (req, res) => {
  const { id } = req.params;
  // console.log("🧪 Incoming medicalConditions:", JSON.stringify(req.body.medicalConditions, null, 2));

  const resident = await Resident.findById(id);

  if (!resident) {
    return res.status(404).json({ message: "Resident not found" });
  }

  // Update top-level fields
  resident.fullName = req.body.fullName || resident.fullName;
  resident.gender = req.body.gender || resident.gender;
  resident.dateOfBirth = req.body.dateOfBirth || resident.dateOfBirth;
  resident.roomNumber = req.body.roomNumber || resident.roomNumber;
  resident.user = req.body.user || resident.user;
  resident.allergies = req.body.allergies || resident.allergies;
  resident.dietaryPreferences = req.body.dietaryPreferences || resident.dietaryPreferences;
  resident.isActive = req.body.isActive !== undefined ? req.body.isActive : resident.isActive;
  resident.photo = req.body.photo || resident.photo;
  resident.medicalHistory = req.body.medicalHistory || resident.medicalHistory;


  // ✅ Update medical conditions if provided
  if (req.body.medicalConditions) {
    resident.medicalConditions = req.body.medicalConditions;
  }

  // Update nested contact info
  if (req.body.contactInfo) {
    resident.contactInfo = {
      ...resident.contactInfo,
      ...req.body.contactInfo,
    };
  }

  // Emergency contacts
  if (req.body.emergencyContacts) {
    resident.emergencyContacts = req.body.emergencyContacts;
  }

  const updated = await resident.save();
  res.json({ message: "Resident updated successfully", resident: updated });
};


// ✅ DELETE resident
exports.deleteResident = async (req, res) => {
  const { id } = req.params;
  const resident = await Resident.findById(id);

  if (!resident) {
    res.status(404);
    throw new Error("Resident not found");
  }

  await resident.deleteOne();
  res.json({ message: "Resident deleted successfully" });
};

// ✅ Upload profile photo for resident
exports.uploadResidentPhoto = async (req, res) => {
  const resident = await Resident.findById(req.params.id);

  if (!resident) {
    res.status(404);
    throw new Error("Resident not found");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const imageUrl = await uploadToCloudinary(req.file);
  resident.photo = imageUrl;
  await resident.save();

  res.status(200).json({ message: "Photo uploaded successfully", photo: imageUrl });
};
