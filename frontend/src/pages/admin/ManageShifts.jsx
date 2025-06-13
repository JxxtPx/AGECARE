import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";

const ManageShifts = () => {
  const [loading, setLoading] = useState(true);
  const [shifts, setShifts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [residents, setResidents] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState(null);

  const [filterResident, setFilterResident] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state using exact backend model fields
  const [formData, setFormData] = useState({
    assignedTo: "", // ✅ use the correct key for backend
    resident: "",
    date: "",
    startTime: "",
    endTime: "",
    type: "Personal Care",
    status: "scheduled",
    notes: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // ✅ 1. Fetch shifts with populated staff and resident
        const shiftRes = await axiosInstance.get("/admin/shifts");
        const shiftsData = shiftRes.data.map((shift) => ({
          ...shift,
          staff: shift.assignedTo, // populated from backend
        }));
        setShifts(shiftsData);

        // ✅ 2. Fetch all users and filter nurses + carers
        const usersRes = await axiosInstance.get("/admin/users");
        const filteredStaff = usersRes.data.filter(
          (user) => user.role === "nurse" || user.role === "carer"
        );
        setStaffList(filteredStaff);

        // ✅ 3. Fetch residents
        const residentRes = await axiosInstance.get("/admin/residents");
        // console.log("👨‍🦳 Residents:", residentRes.data);
        setResidents(residentRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load shift data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateShift = () => {
    setSelectedShift(null);
    setFormData({
      assignedTo: "",
      resident: "",
      date: "",
      startTime: "",
      endTime: "",
      type: "Personal Care",
      status: "scheduled",
      notes: "",
    });
    setShowModal(true);
  };

  const handleEditShift = (shift) => {
    setSelectedShift(shift);
    setFormData({
      assignedTo: shift.staff._id,
      resident: shift.resident._id,
      date: shift.date,
      startTime: shift.startTime,
      endTime: shift.endTime,
      type: shift.type,
      status: shift.status.toLowerCase(),
      notes: shift.notes,
    });
    setShowModal(true);
  };

  const handleDeleteShift = (shift) => {
    setShiftToDelete(shift);
    setShowConfirmDelete(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      if (
        !formData.staff ||
        !formData.resident ||
        !formData.date ||
        !formData.startTime ||
        !formData.endTime
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      const start = new Date(`${formData.date}T${formData.startTime}`);
      let end = new Date(`${formData.date}T${formData.endTime}`);

      // ⏱ Add 1 day if shift ends after midnight (i.e., overnight shift)
      if (end <= start) {
        end.setDate(end.getDate() + 1);
      }

      const payload = {
        assignedTo: formData.staff,
        resident: formData.resident,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        type: formData.type, // must match backend enum
        status: formData.status,
        notes: formData.notes,
      };

      if (selectedShift) {
        await axiosInstance.put(`/admin/shifts/${selectedShift._id}`, payload);
        toast.success("Shift updated successfully");
      } else {
        await axiosInstance.post("/admin/shifts", payload);
        toast.success("Shift created successfully");
      }

      // ✅ Refetch all shifts to get updated resident/staff details
      const updatedRes = await axiosInstance.get("/admin/shifts");
      const updatedShifts = updatedRes.data.map((shift) => ({
        ...shift,
        staff: shift.assignedTo, // normalize field
      }));
      setShifts(updatedShifts);
      // toast.success(selectedShift ? "Shift updated" : "Shift created");
      setShowModal(false);
    } catch (error) {
      console.error("❌ Shift save failed:", error);
      toast.error("Failed to save shift");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredShifts = shifts.filter((shift) => {
    const staffName = shift?.staff?.name?.toLowerCase() || "";
    const residentName = shift?.resident?.name?.toLowerCase() || "";

    const matchesSearch =
      staffName.includes(searchTerm.toLowerCase()) ||
      residentName.includes(searchTerm.toLowerCase());

    const normalizedShiftStatus = shift?.status?.toLowerCase() || "";
    const normalizedFilterStatus = filterStatus.toLowerCase();

    const matchesStatus =
      normalizedFilterStatus === "all" ||
      normalizedShiftStatus === normalizedFilterStatus;

    const matchesResident =
      !filterResident || shift?.resident?._id === filterResident;

    const matchesRole = !filterRole || shift?.staff?.role === filterRole;

    const shiftDate = new Date(shift?.date);
    const fromDate = filterFromDate ? new Date(filterFromDate) : null;
    const toDate = filterToDate ? new Date(filterToDate) : null;

    const matchesDate =
      (!fromDate || shiftDate >= fromDate) && (!toDate || shiftDate <= toDate);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesResident &&
      matchesRole &&
      matchesDate
    );
  });

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Shifts</h1>
          <p className="mt-1 text-sm text-gray-600">
            Schedule and manage staff shifts
          </p>
        </div>
        <button onClick={handleCreateShift} className="btn btn-primary">
          <FiPlus className="w-5 h-5 mr-2" />
          Create Shift
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
        {/* Header Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shift Status
            </label>
            <select
              className="py-2 px-3 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Shifts</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowAdvancedFilters((prev) => !prev)}
            className="text-sm font-medium text-rose-600 hover:text-rose-700 flex items-center"
          >
            {showAdvancedFilters ? (
              <>
                <FiChevronUp className="mr-1" />
                Hide Advanced Filters
              </>
            ) : (
              <>
                <FiChevronDown className="mr-1" />
                Show Advanced Filters
              </>
            )}
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Resident */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resident
              </label>
              <select
                className="py-2 px-3 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400"
                value={filterResident}
                onChange={(e) => setFilterResident(e.target.value)}
              >
                <option value="">All Residents</option>
                {residents.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Staff Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Staff Role
              </label>
              <select
                className="py-2 px-3 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="nurse">Nurse</option>
                <option value="carer">Carer</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-1/2 py-2 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400"
                  value={filterFromDate}
                  onChange={(e) => setFilterFromDate(e.target.value)}
                />
                <input
                  type="date"
                  className="w-1/2 py-2 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400"
                  value={filterToDate}
                  onChange={(e) => setFilterToDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shifts Table */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resident
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredShifts.map((shift) => (
                <tr
                  key={shift._id || Math.random()}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {shift?.staff?.name || "Unknown Staff"}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                      {shift?.staff?.role || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {shift?.resident?.fullName || "Unknown Resident"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {shift?.date
                        ? new Date(shift.date)
                            .toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                            .replace(/ /g, "-")
                            .replace(",", "")
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {shift?.startTime || "?"} - {shift?.endTime || "?"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">
                      {shift?.type || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={shift?.status || "pending"} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditShift(shift)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteShift(shift)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto px-4">
          <div className="inline-block w-full max-w-lg bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all my-8">
            <div className="bg-white px-4 pt-5 pb-6 sm:px-6 sm:pb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-semibold text-gray-900">
                  {selectedShift ? "Edit Shift" : "Create New Shift"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4 max-h-[65vh] overflow-y-auto pr-1"
              >
                {/* Staff Member */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Staff Member
                  </label>
                  <select
                    className="form-input w-full"
                    value={formData.staff}
                    onChange={(e) =>
                      setFormData({ ...formData, staff: e.target.value })
                    }
                    required
                  >
                    <option value="">Select staff member</option>
                    <optgroup label="Nurses">
                      {staffList
                        .filter((s) => s.role === "nurse")
                        .map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name}
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Carers">
                      {staffList
                        .filter((s) => s.role === "carer")
                        .map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name}
                          </option>
                        ))}
                    </optgroup>
                  </select>
                </div>

                {/* Resident */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resident
                  </label>
                  <select
                    className="form-input w-full"
                    value={formData.resident}
                    onChange={(e) =>
                      setFormData({ ...formData, resident: e.target.value })
                    }
                    required
                  >
                    <option value="">Select resident</option>
                    {residents.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="form-input w-full"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:ring-rose-500 focus:border-rose-500 shadow-sm"
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({ ...formData, startTime: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:ring-rose-500 focus:border-rose-500 shadow-sm"
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData({ ...formData, endTime: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shift Type
                  </label>
                  <select
                    className="form-input w-full"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="Medication">Medication</option>
                    <option value="Meal">Meal</option>
                    <option value="Check-in">Check-in</option>
                    <option value="General">General</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="form-input w-full"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    required
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    className="form-input w-full"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Optional notes"
                  />
                </div>
              </form>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary flex items-center justify-center min-w-[130px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="animate-pulse">
                    {selectedShift ? "Updating..." : "Creating..."}
                  </span>
                ) : selectedShift ? (
                  "Update Shift"
                ) : (
                  "Create Shift"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete shift assigned to{" "}
              <span className="font-semibold text-red-600">
                {shiftToDelete?.staff?.name || "Unknown"}
              </span>
              ?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConfirmDelete(false);
                  setShiftToDelete(null);
                }}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!shiftToDelete || !shiftToDelete._id) {
                    toast.error("Invalid shift selected for deletion");
                    return;
                  }

                  try {
                    await axiosInstance.delete(
                      `/admin/shifts/${shiftToDelete._id}`
                    );
                    setShifts((prev) =>
                      prev.filter((shift) => shift._id !== shiftToDelete._id)
                    );
                    toast.success("Shift deleted successfully");
                  } catch (error) {
                    toast.error("Failed to delete shift");
                  } finally {
                    setShowConfirmDelete(false);
                    setShiftToDelete(null);
                  }
                }}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageShifts;
