import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiClock,
  FiCheck,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";

const ManageVisitRequests = () => {
  const [loading, setLoading] = useState(true);
  const [visitRequests, setVisitRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    const fetchVisitRequests = async () => {
      try {
        const { data } = await axiosInstance.get("/admin/visits");
        setVisitRequests(data);
      } catch (error) {
        console.error("Error fetching visit requests:", error);
        toast.error("Failed to load visit requests");
      } finally {
        setLoading(false);
      }
    };

    fetchVisitRequests();
  }, []);

  const handleAction = (request, action) => {
    setSelectedRequest(request);
    setPendingAction(action);
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest || !pendingAction) return;

    try {
      await axiosInstance.put(`/admin/visits/${selectedRequest._id}`, {
        status: pendingAction,
      });

      setVisitRequests((prev) =>
        prev.map((req) =>
          req._id === selectedRequest._id
            ? { ...req, status: pendingAction }
            : req
        )
      );

      toast.success(`Visit request ${pendingAction} successfully`);
      setShowModal(false);
      setSelectedRequest(null);
      setPendingAction(null);
    } catch (error) {
      toast.error(`Failed to ${pendingAction} visit request`);
    }
  };

  const filteredRequests = visitRequests.filter((request) => {
    const matchesSearch =
      request.family.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.resident.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Manage Visit Requests
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Review and manage visitor requests for residents
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 hidden sm:flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md py-2 text-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 pl-3 sm:pl-10"
              placeholder="Search by visitor or resident name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 hidden sm:flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="w-full border border-gray-300 rounded-md py-2 text-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 pl-3 sm:pl-10"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Optional Category Placeholder */}
        </div>
      </div>

      {/* Visit Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div
            key={request._id}
            className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Visit Request for {request.resident.fullName}
                    </h3>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    Visitor: {request.family.name}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  Requested: {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-4 space-y-1">
                <p className="text-sm text-gray-600">
                  Visit Date:{" "}
                  {new Date(request.visitDate)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(/ /g, "-")}
                </p>
                <p className="text-sm text-gray-600">
                  Visit Time: {request.visitTime}
                </p>
              </div>
              {request.reason && (
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium text-gray-700">Reason:</span>{" "}
                  {request.reason}
                </p>
              )}

              {request.status === "pending" && (
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => handleAction(request, "approved")}
                    className="btn btn-primary text-sm"
                  >
                    <FiCheck className="w-4 h-4 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(request, "rejected")}
                    className="btn btn-outline text-sm text-red-600 hover:bg-red-50"
                  >
                    <FiX className="w-4 h-4 mr-2" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-card">
            <FiClock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No visit requests found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No visit requests match your current filters.
            </p>
          </div>
        )}
      </div>

      {/* Confirm Action Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiAlertCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Confirm Action
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to {pendingAction} this visit
                        request?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                    pendingAction === "approved"
                      ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                      : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  }`}
                >
                  {pendingAction === "approved" ? "Approve" : "Reject"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedRequest(null);
                    setPendingAction(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVisitRequests;
