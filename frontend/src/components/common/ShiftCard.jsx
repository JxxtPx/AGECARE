import React from "react";
import {
  FiClock,
  FiCalendar,
  FiCheckCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const ShiftCard = ({ shift }) => {
  const navigate = useNavigate();

  const {
    _id: id,
    date,
    startTime,
    endTime,
    actualStartTime,
    actualEndTime,
    status,
    shiftType,
    hasNotes,
    resident,
  } = shift;

  const residentName = resident?.fullName || "Unknown";
  const residentRoom = resident?.roomNumber || "N/A";

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const formatTime = (timeString) => {
      if (!timeString) return '—';
    
      // Handle simple "HH:mm" strings (e.g., "10:15")
      if (typeof timeString === 'string' && /^\d{1,2}:\d{2}$/.test(timeString)) {
        const [hours, minutes] = timeString.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) return '—';
    
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
      }
    
      // Handle full datetime strings
      const dateObj = new Date(timeString);
      if (!isNaN(dateObj)) {
        return dateObj.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
      }
    
      return '—';
    };
    
  const getShiftBgColor = () => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200";
      case "in-progress":
        return "bg-blue-50 border-blue-200";
      case "missed":
        return "bg-red-50 border-red-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getShiftTypeLabel = () => {
    switch (shiftType?.toLowerCase()) {
      case "morning":
        return { text: "Morning Shift", color: "bg-yellow-100 text-yellow-800" };
      case "afternoon":
        return { text: "Afternoon Shift", color: "bg-orange-100 text-orange-800" };
      case "night":
        return { text: "Night Shift", color: "bg-indigo-100 text-indigo-800" };
      default:
        return { text: shiftType || "Regular Shift", color: "bg-gray-100 text-gray-800" };
    }
  };

  const shiftTypeInfo = getShiftTypeLabel();

  const handleNavigate = () => {
    navigate(`/carer/shift/${shift._id}`, { state: { shift } });
  };

  return (
    <div
      onClick={handleNavigate}
      className={`rounded-xl border ${getShiftBgColor()} shadow-lg hover:shadow-xl transition-all duration-300 p-5 cursor-pointer`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${shiftTypeInfo.color}`}
            >
              {shiftTypeInfo.text}
            </span>
            <StatusBadge status={status} size="md" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mt-3">
            {residentName}
          </h3>
          <p className="text-base text-gray-600 mt-1">Room {residentRoom}</p>
        </div>

        {hasNotes && (
          <div className="bg-primary-50 text-primary-700 text-sm px-3 py-1.5 rounded-full font-medium">
            Has Notes
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2.5">
        <div className="flex items-center text-sm text-gray-600">
          <FiCalendar className="mr-2 text-gray-400" />
          <span>{formatDate(date)}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <FiClock className="mr-2 text-gray-400" />
          <span>
            Scheduled: {formatTime(startTime)} - {formatTime(endTime)}
          </span>
        </div>

        {actualStartTime && (
          <div className="flex items-center text-sm text-green-600">
            <FiCheckCircle className="mr-2 text-green-500" />
            <span>Started at: {formatTime(actualStartTime)}</span>
          </div>
        )}

        {actualEndTime && (
          <div className="flex items-center text-sm text-green-600">
            <FiCheckCircle className="mr-2 text-green-500" />
            <span>Completed at: {formatTime(actualEndTime)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftCard;
