const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");

// === Route Imports (YOUR STYLE) ===
const adminUserRoutes = require("./routes/admin/userRoutes");
const authRoutes = require("./routes/auth/authRoutes");
const adminResidentRoutes = require("./routes/admin/residentRoutes");
const adminShiftRoutes = require("./routes/admin/shiftRoutes");
const adminShiftNoteRoutes = require("./routes/admin/shiftNoteRoutes");
const adminFileRoutes = require("./routes/admin/fileRoutes");
const adminAnalyticsRoutes = require("./routes/admin/analyticsRoutes");
const adminFamilyRoutes = require("./routes/admin/familyApprovalRoutes");
const adminVisitRoutes = require("./routes/admin/visitRoutes");

const nurseShiftRoutes = require("./routes/nurse/shiftRoutes");
const nurseShiftNoteRoutes = require("./routes/nurse/shiftNoteRoutes");
const nurseTaskRoutes = require("./routes/nurse/taskRoutes");

const carerShiftRoutes = require("./routes/carer/shiftRoutes");
const carerShiftNoteRoutes = require("./routes/carer/shiftNoteRoutes");
const carerTaskRoutes = require("./routes/carer/taskRoutes");

const coordinatorCarePlanRoutes = require("./routes/coordinator/carePlanRoutes");
const coordinatorTaskRoutes = require("./routes/coordinator/taskRoutes");
const coordinatorShiftNoteRoutes = require("./routes/coordinator/shiftNoteRoutes");

const residentRoutes = require("./routes/resident/residentRoutes");
const residentFeedbackRoutes = require("./routes/resident/feedbackRoutes");

const familyAuthRoutes = require("./routes/family/authRoutes");
const familyResidentRoutes = require("./routes/family/residentRoutes");
const familyFileRoutes = require("./routes/family/fileRoutes");
const familyNoteRoutes = require("./routes/family/noteRoutes");
const familyVisitRoutes = require("./routes/family/visitRoutes");

const sharedChatRoutes = require("./routes/chat/chatRoutes");
const sharedFeedbackRoutes = require("./routes/shared/feedbackRoutes");
const sharedIncidentRoutes = require("./routes/shared/incidentRoutes");
const sharedFileRoutes = require("./routes/shared/fileRoutes");
const sharedHealthRoutes = require("./routes/shared/healthRecordRoutes");
const sharedNotificationRoutes = require("./routes/shared/notificationRoutes");
const sharedProfileRoutes = require("./routes/shared/profileRoutes");


dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL ||  true, // your frontend address
  credentials: true,
}))
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is connected!' });
});

// === Route Mounting ===
app.use("/api/auth", authRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/residents", adminResidentRoutes);
app.use("/api/admin/shifts", adminShiftRoutes);
app.use("/api/admin/shiftnotes", adminShiftNoteRoutes);
app.use("/api/admin/resident-files", adminFileRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);
app.use("/api/admin/family", adminFamilyRoutes);
app.use("/api/admin/visits", adminVisitRoutes);

app.use("/api/nurse/shifts", nurseShiftRoutes);
app.use("/api/nurse/shiftnotes", nurseShiftNoteRoutes);
app.use("/api/nurse/tasks", nurseTaskRoutes);

app.use("/api/carer/shifts", carerShiftRoutes);
app.use("/api/carer/shiftnotes", carerShiftNoteRoutes);
app.use("/api/carer/tasks", carerTaskRoutes);

app.use("/api/coordinator/careplans", coordinatorCarePlanRoutes);
app.use("/api/coordinator/tasks", coordinatorTaskRoutes);
app.use("/api/coordinator/shift-notes", coordinatorShiftNoteRoutes);

app.use("/api/resident", residentRoutes);
app.use("/api/resident/feedback", residentFeedbackRoutes);

app.use("/api/family/auth", familyAuthRoutes);
app.use("/api/family/resident", familyResidentRoutes);
app.use("/api/family/files", familyFileRoutes);
app.use("/api/family/notes", familyNoteRoutes);
app.use("/api/family/visits", familyVisitRoutes);

app.use("/api/chat", sharedChatRoutes);
app.use("/api/shared/feedback", sharedFeedbackRoutes);
app.use("/api/shared/incidents", sharedIncidentRoutes);
app.use("/api/shared/files", sharedFileRoutes);
app.use("/api/shared/health-records", sharedHealthRoutes);
app.use("/api/shared/notifications", sharedNotificationRoutes);
app.use("/api/shared/profile", sharedProfileRoutes);


// === 404 Route ===
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// === Global Error Handler ===
app.use(errorHandler);


// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0' ,() => console.log(`✅ Server running on port ${PORT}`));
