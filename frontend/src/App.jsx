import React, { useContext, Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { Analytics } from "@vercel/analytics/react";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";

// Shared Components
import LoadingPage from "./pages/shared/LoadingPage";
import NotFound from "./pages/shared/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import SetPassword from "./pages/auth/SetPassword";
import Signup from "./pages/auth/Signup";

// Lazy-loaded role-specific pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));
const ManageResidents = lazy(() => import("./pages/admin/ManageResidents"));
const ManageShifts = lazy(() => import("./pages/admin/ManageShifts"));
const ManageFeedbacks = lazy(() => import("./pages/admin/ManageFeedbacks"));
const ManageVisitRequests = lazy(() =>
  import("./pages/admin/ManageVisitRequests")
);
const ManageIncidents = lazy(() => import("./pages/admin/ManageIncidents"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminMessages = lazy(() => import("./pages/admin/Messages"));
const AdminProfile = lazy(() => import("./pages/admin/Profile"));
const ManageFamilyRequests = lazy(() =>
  import("./pages/admin/ManageFamilyRequests")
);

const CoordinatorDashboard = lazy(() =>
  import("./pages/coordinator/Dashboard")
);
const ManageCarePlans = lazy(() =>
  import("./pages/coordinator/ManageCarePlans")
);
const ManageTasks = lazy(() => import("./pages/coordinator/ManageTasks"));
const FlagShiftNotes = lazy(() => import("./pages/coordinator/FlagShiftNotes"));
const CoordinatorMessages = lazy(() => import("./pages/coordinator/Messages"));
const CoordinatorProfile = lazy(() => import("./pages/coordinator/Profile"));

const NurseDashboard = lazy(() => import("./pages/nurse/Dashboard"));
const NurseMyShifts = lazy(() => import("./pages/nurse/MyShifts"));
const NurseMyShiftNotes = lazy(() => import("./pages/nurse/MyShiftNotes"));
const NurseViewResidents = lazy(() => import("./pages/nurse/ViewResidents"));
const NurseReportIncidents = lazy(() =>
  import("./pages/nurse/ReportIncidents")
);
const NurseProfile = lazy(() => import("./pages/nurse/Profile"));

const CarerDashboard = lazy(() => import("./pages/carer/Dashboard"));
const CarerMyShifts = lazy(() => import("./pages/carer/MyShifts"));
const CarerMyShiftNotes = lazy(() => import("./pages/carer/MyShiftNotes"));
const CarerViewResidents = lazy(() => import("./pages/carer/ViewResidents"));
const CarerReportIncidents = lazy(() =>
  import("./pages/carer/ReportIncidents")
);
const CarerProfile = lazy(() => import("./pages/carer/Profile"));

const ResidentDashboard = lazy(() => import("./pages/resident/Dashboard"));
const ViewCarePlan = lazy(() => import("./pages/resident/ViewCarePlan"));
const ResidentViewShiftNotes = lazy(() =>
  import("./pages/resident/ViewShiftNotes")
);
const SubmitFeedback = lazy(() => import("./pages/resident/SubmitFeedback"));
const ResidentReportIncident = lazy(() =>
  import("./pages/resident/ReportIncident")
);
const ResidentProfile = lazy(() => import("./pages/resident/Profile"));

const FamilyDashboard = lazy(() => import("./pages/family/Dashboard"));
const ViewResidentProfile = lazy(() =>
  import("./pages/family/ViewResidentProfile")
);
const VisitRequests = lazy(() => import("./pages/family/VisitRequests"));
const FamilyViewShiftNotes = lazy(() =>
  import("./pages/family/ViewShiftNotes")
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/unauthorized" replace />;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Suspense fallback={<LoadingPage />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
};

function App() {
  const { isAuthenticated, user, isLoading } = useContext(AuthContext);

  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (isAuthenticated && user) {
  //     navigate(getRedirectPath(), { replace: true });
  //   }
  // }, [isAuthenticated, user]);

  if (isLoading) return <LoadingPage />;

  // Helper function to get redirect path based on user role
  const getRedirectPath = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "admin":
        return "/admin";
      case "coordinator":
        return "/coordinator";
      case "nurse":
        return "/nurse";
      case "carer":
        return "/carer";
      case "resident":
        return "/resident";
      case "family":
        return "/family";
      default:
        return "/login";
    }
  };

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/set-password" element={<SetPassword />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/residents"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageResidents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/shifts"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageShifts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/feedbacks"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageFeedbacks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/visit-requests"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageVisitRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/incidents"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageIncidents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/family-requests"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageFamilyRequests />
            </ProtectedRoute>
          }
        />

        {/* Coordinator Routes */}
        <Route
          path="/coordinator"
          element={
            <ProtectedRoute allowedRoles={["coordinator"]}>
              <CoordinatorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coordinator/care-plans"
          element={
            <ProtectedRoute allowedRoles={["coordinator"]}>
              <ManageCarePlans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coordinator/tasks"
          element={
            <ProtectedRoute allowedRoles={["coordinator"]}>
              <ManageTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coordinator/flag-notes"
          element={
            <ProtectedRoute allowedRoles={["coordinator"]}>
              <FlagShiftNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coordinator/messages"
          element={
            <ProtectedRoute allowedRoles={["coordinator"]}>
              <CoordinatorMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coordinator/profile"
          element={
            <ProtectedRoute allowedRoles={["coordinator"]}>
              <CoordinatorProfile />
            </ProtectedRoute>
          }
        />

        {/* Nurse Routes */}
        <Route
          path="/nurse"
          element={
            <ProtectedRoute allowedRoles={["nurse"]}>
              <NurseDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/shifts"
          element={
            <ProtectedRoute allowedRoles={["nurse"]}>
              <NurseMyShifts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/shift-notes"
          element={
            <ProtectedRoute allowedRoles={["nurse"]}>
              <NurseMyShiftNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/residents"
          element={
            <ProtectedRoute allowedRoles={["nurse"]}>
              <NurseViewResidents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/incidents"
          element={
            <ProtectedRoute allowedRoles={["nurse"]}>
              <NurseReportIncidents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse/profile"
          element={
            <ProtectedRoute allowedRoles={["nurse"]}>
              <NurseProfile />
            </ProtectedRoute>
          }
        />

        {/* Carer Routes */}
        <Route
          path="/carer"
          element={
            <ProtectedRoute allowedRoles={["carer"]}>
              <CarerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carer/shifts"
          element={
            <ProtectedRoute allowedRoles={["carer"]}>
              <CarerMyShifts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carer/shift-notes"
          element={
            <ProtectedRoute allowedRoles={["carer"]}>
              <CarerMyShiftNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carer/residents"
          element={
            <ProtectedRoute allowedRoles={["carer"]}>
              <CarerViewResidents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carer/incidents"
          element={
            <ProtectedRoute allowedRoles={["carer"]}>
              <CarerReportIncidents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carer/profile"
          element={
            <ProtectedRoute allowedRoles={["carer"]}>
              <CarerProfile />
            </ProtectedRoute>
          }
        />

        {/* Resident Routes */}
        <Route
          path="/resident"
          element={
            <ProtectedRoute allowedRoles={["resident"]}>
              <ResidentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resident/care-plan"
          element={
            <ProtectedRoute allowedRoles={["resident"]}>
              <ViewCarePlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resident/shift-notes"
          element={
            <ProtectedRoute allowedRoles={["resident"]}>
              <ResidentViewShiftNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resident/feedback"
          element={
            <ProtectedRoute allowedRoles={["resident"]}>
              <SubmitFeedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resident/incident"
          element={
            <ProtectedRoute allowedRoles={["resident"]}>
              <ResidentReportIncident />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resident/profile"
          element={
            <ProtectedRoute allowedRoles={["resident"]}>
              <ResidentProfile />
            </ProtectedRoute>
          }
        />

        {/* Family Routes */}
        <Route
          path="/family"
          element={
            <ProtectedRoute allowedRoles={["family"]}>
              <FamilyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/family/resident"
          element={
            <ProtectedRoute allowedRoles={["family"]}>
              <ViewResidentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/family/visits"
          element={
            <ProtectedRoute allowedRoles={["family"]}>
              <VisitRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/family/shift-notes"
          element={
            <ProtectedRoute allowedRoles={["family"]}>
              <FamilyViewShiftNotes />
            </ProtectedRoute>
          }
        />

        {/* Redirect based on role */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={getRedirectPath()} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Analytics />
    </>
  );
}

export default App;
