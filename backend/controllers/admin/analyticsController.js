const Resident = require("../../models/Resident");
const User = require("../../models/User");
const File = require("../../models/File");
const VisitRequest = require("../../models/VisitRequest");
const ShiftNote = require("../../models/ShiftNote");
const Incident = require("../../models/Incident");

exports.getAdminAnalytics = async (req, res) => {
  const [
    totalResidents,
    totalFiles,
    totalShiftNotes,
    totalVisits,
    totalNurses,
    totalCarers
  ] = await Promise.all([
    Resident.countDocuments(),
    File.countDocuments(),
    ShiftNote.countDocuments(),
    VisitRequest.countDocuments({ status: "approved" }),
    User.countDocuments({ role: "nurse" }),
    User.countDocuments({ role: "carer" })
  ]);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const newResidents = await Resident.find({ createdAt: { $gte: weekAgo } })
    .sort({ createdAt: -1 })
    .limit(5);

  const recentIncidents = await Incident.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("reportedBy", "name role")
    .populate("resident", "fullName");
  

  const recentActivity = [];

  newResidents.forEach((r) => {
    recentActivity.push({
      type: "resident",
      action: "New Resident Added",
      user: `Resident: ${r.fullName}`,
      time: r.createdAt,
    });
  });

  recentIncidents.forEach((i) => {
    recentActivity.push({
      type: "incident",
      action: "Incident Reported",
      user: `By: ${i.reportedBy?.name || "Staff"}`,
      time: i.createdAt,
    });
  });
  

  recentActivity.sort((a, b) => new Date(b.time) - new Date(a.time));

  // === Monthly User Count (Dynamic Chart Data) ===
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const monthlyUserCountsRaw = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfYear },
        role: { $in: ["nurse", "carer", "coordinator", "resident", "family"] }
      }
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const monthlyUserCounts = Array.from({ length: 12 }, (_, i) => {
    const found = monthlyUserCountsRaw.find((m) => m._id === i + 1);
    return {
      month: monthNames[i],
      count: found ? found.count : 0
    };
  });

  res.json({
    totalResidents,
    totalNurses,
    totalCarers,
    totalFiles,
    totalShiftNotes,
    upcomingVisits: totalVisits,
    openIncidents: await Incident.countDocuments({ status: "open" }),
    closedIncidents: await Incident.countDocuments({ status: "closed" }),
    incidentsThisMonth: await Incident.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
    }),
    newResidentsLast7Days: newResidents.length,
    recentActivity: recentActivity.slice(0, 8),
    monthlyUserCounts
  });
};
