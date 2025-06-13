import React, { useState, useEffect, useContext, useMemo } from "react";
import { FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import ShiftCard from "../../components/common/ShiftCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { toast } from "react-toastify";

const MyShifts = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/carer/shifts/assigned/${user.id}`
        );
        // Sort shifts by date (nearest to furthest) when data is fetched
        const sortedShifts = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
        setShifts(sortedShifts);
      } catch (error) {
        toast.error("Failed to load shifts");
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, [user.id]);

  // Memoize the empty state JSX to prevent unnecessary re-renders
  const emptyState = useMemo(() => (
    <div className="text-center py-12 bg-white rounded-xl shadow-lg">
      <FiClock className="mx-auto h-16 w-16 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        No upcoming shifts
      </h3>
      <p className="mt-2 text-base text-gray-600">
        You don't have any shifts scheduled.
      </p>
    </div>
  ), []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Shifts</h1>
        <p className="text-gray-600 mt-1">
          View your upcoming shifts
        </p>
      </div>

      {/* Shift Cards */}
      <div className="space-y-4">
        {shifts.map((shift) => (
          <ShiftCard key={shift._id} shift={shift} />
        ))}

        {shifts.length === 0 && emptyState}
      </div>
    </div>
  );
};

export default MyShifts;
