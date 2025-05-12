import React, { useState, useEffect } from 'react';
import { FiClipboard, FiMessageSquare, FiAlertCircle, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [residentInfo, setResidentInfo] = useState(null);

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setResidentInfo({
        name: 'John Smith',
        activeCarePlan: true,
        totalFeedbacks: 5,
        openIncidents: 1,
        totalShiftNotes: 12,
        nextShift: {
          date: '2024-05-02',
          time: '08:00 AM - 04:00 PM',
          room: 'Room 12A'
        }
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {residentInfo.name} 👋
        </h1>
        <p className="text-gray-600 mt-2">Here's what's happening today!</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-white p-5 rounded-xl shadow-lg text-center">
          <FiClipboard className="mx-auto text-blue-500" size={28} />
          <h2 className="text-xl font-semibold mt-2">Care Plan</h2>
          <p className="text-gray-600">{residentInfo.activeCarePlan ? 'Active' : 'Not Available'}</p>
        </div>

        <div className="card bg-white p-5 rounded-xl shadow-lg text-center">
          <FiMessageSquare className="mx-auto text-green-500" size={28} />
          <h2 className="text-xl font-semibold mt-2">Feedbacks</h2>
          <p className="text-gray-600">{residentInfo.totalFeedbacks}</p>
        </div>

        <div className="card bg-white p-5 rounded-xl shadow-lg text-center">
          <FiAlertCircle className="mx-auto text-red-500" size={28} />
          <h2 className="text-xl font-semibold mt-2">Incidents</h2>
          <p className="text-gray-600">{residentInfo.openIncidents}</p>
        </div>

        <div className="card bg-white p-5 rounded-xl shadow-lg text-center">
          <FiClock className="mx-auto text-purple-500" size={28} />
          <h2 className="text-xl font-semibold mt-2">Shift Notes</h2>
          <p className="text-gray-600">{residentInfo.totalShiftNotes}</p>
        </div>
      </div>

      {/* Next Shift Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Upcoming Shift</h2>
        {residentInfo.nextShift ? (
          <div className="space-y-2">
            <p className="text-gray-700"><strong>Date:</strong> {residentInfo.nextShift.date}</p>
            <p className="text-gray-700"><strong>Time:</strong> {residentInfo.nextShift.time}</p>
            <p className="text-gray-700"><strong>Room:</strong> {residentInfo.nextShift.room}</p>
          </div>
        ) : (
          <p className="text-gray-500">No upcoming shifts scheduled.</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/resident/care-plan" className="btn btn-primary w-full text-center">
            View Care Plan
          </Link>
          <Link to="/resident/shift-notes" className="btn btn-primary w-full text-center">
            View Shift Notes
          </Link>
          <Link to="/resident/feedback" className="btn btn-primary w-full text-center">
            Submit Feedback
          </Link>
          <Link to="/resident/incident" className="btn btn-primary w-full text-center">
            Report Incident
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
