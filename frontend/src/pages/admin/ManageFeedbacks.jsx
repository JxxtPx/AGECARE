import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiMessageSquare,
  FiX,
  FiSend,
} from "react-icons/fi";
import axiosInstance from "../../api/axiosInstance";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import { toast } from "react-toastify";

const ManageFeedbacks = () => {
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [response, setResponse] = useState("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const { data } = await axiosInstance.get("/shared/feedback");
        setFeedbacks(data);
      } catch (error) {
        toast.error("Failed to load feedbacks");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleViewFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setResponse("");
    setShowModal(true);
  };

  const handleSubmitResponse = async () => {
    if (!response.trim()) {
      toast.error("Please enter a response");
      return;
    }

    try {
      await axiosInstance.put(`/shared/feedback/${selectedFeedback._id}`, {
        response,
        status: "resolved",
      });

      setFeedbacks(
        feedbacks.map((feedback) =>
          feedback._id === selectedFeedback._id
            ? { ...feedback, response, status: "resolved" }
            : feedback
        )
      );

      toast.success("Response submitted successfully");
      setResponse("");
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to submit response");
    }
  };

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.resident.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      feedback.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || feedback.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || feedback.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Feedbacks</h1>
        <p className="mt-1 text-sm text-gray-600">
          Review and respond to resident feedback
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
              placeholder="Search by resident or message..."
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
              <option value="responded">Responded</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              className="w-full border border-gray-300 rounded-md py-2 text-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="General">General</option>
              <option value="Medical">Medical</option>
              <option value="Room">Room</option>
              <option value="Complaint">Complaint</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedbacks List */}
      <div className="space-y-4">
        {filteredFeedbacks.map((feedback) => (
          <div
            key={feedback._id}
            className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Feedback from {feedback.resident.fullName}
                    </h3>
                    <StatusBadge status={feedback.status} />
                  </div>
                  <p className="text-sm text-gray-500">
                    Category: {feedback.category}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-gray-600">{feedback.message}</p>
              </div>

              {feedback.response && (
                <div className="mt-4 p-3 bg-green-50 text-sm rounded-md">
                  <strong className="block text-green-700">
                    Admin Response:
                  </strong>
                  <p className="text-green-800">{feedback.response}</p>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleViewFeedback(feedback)}
                  className="btn btn-outline text-sm"
                >
                  {feedback.status === "pending" || feedback.status === "open"
                    ? "Respond"
                    : "View Details"}
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredFeedbacks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-card">
            <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No feedbacks found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No feedbacks match your current filters.
            </p>
          </div>
        )}
      </div>

      {/* Response Modal */}
      {showModal && selectedFeedback && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Feedback Details
                      </h3>
                      <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        From: {selectedFeedback.resident.fullName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Category: {selectedFeedback.category}
                      </p>
                      <p className="text-sm text-gray-500">
                        Date:{" "}
                        {new Date(
                          selectedFeedback.createdAt
                        ).toLocaleDateString()}
                      </p>
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          {selectedFeedback.message}
                        </p>
                      </div>
                    </div>

                    {selectedFeedback.status === "pending" ||
                    selectedFeedback.status === "open" ? (
                      <div className="mt-4">
                        <label
                          htmlFor="response"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Your Response
                        </label>
                        <textarea
                          id="response"
                          rows={4}
                          className="mt-1 form-input"
                          value={response}
                          onChange={(e) => setResponse(e.target.value)}
                          placeholder="Type your response here..."
                        />
                      </div>
                    ) : (
                      selectedFeedback.response && (
                        <div className="mt-4 p-3 bg-green-50 text-sm rounded-md">
                          <strong className="block text-green-700">
                            Admin Response:
                          </strong>
                          <p className="text-green-800">
                            {selectedFeedback.response}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {(selectedFeedback.status === "pending" ||
                  selectedFeedback.status === "open") && (
                  <button
                    type="button"
                    onClick={handleSubmitResponse}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    <FiSend className="w-4 h-4 mr-2" />
                    Send Response
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFeedbacks;
