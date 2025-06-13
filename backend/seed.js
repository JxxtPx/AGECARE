// seedNoteCategories.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const NoteCategory = require("./models/NoteCategory");
const Resident = require("./models/Resident");

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const resident = await Resident.findById("6807af9f82c944a65c18457a");
    if (!resident) {
      console.error("❌ No resident found.");
      return process.exit(1);
    }

    const categories = [
      // { name: "Carer Notes", rolesAllowed: ["carer"], resident: resident._id },
      // { name: "Nurse Notes", rolesAllowed: ["nurse"], resident: resident._id },
      { name: "Wound Care", rolesAllowed: ["nurse", "carer"], resident: resident._id }
    ];

    await NoteCategory.insertMany(categories);
    console.log("✅ Categories seeded.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();
