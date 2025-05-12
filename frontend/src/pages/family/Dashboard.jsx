import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiClock, FiUser, FiActivity, FiThermometer, FiPlusCircle } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const FamilyDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [resident, setResident] = useState(null);
  const [recentUpdates, setRecentUpdates] = useState([]);

  useEffect(() => {
    const fetchResident = async () => {
      try {
        // Mock resident + recent updates data
        setTimeout(() => {
          setResident({
            id: 'res123',
            name: 'John Smith',
            dob: '1942-05-14',
            roomNumber: '101',
            medicalHistory: 'Hypertension, Diabetes',
            vitals: {
              heartRate: 78,
              bloodPressure: '130/85',
              temperature: '36.6°C',
            },
          });

          setRecentUpdates([
            { id: 1, type: 'Doctor Visit', time: '2 hours ago' },
            { id: 2, type: 'Medication Updated', time: 'Yesterday' },
            { id: 3, type: 'Daily Check Completed', time: 'Today' },
          ]);

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching resident:', error);
        setLoading(false);
      }
    };

    fetchResident();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-primary-50 via-white to-primary-100 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900">Good Morning, James!</h1>
        <p className="text-gray-600 mt-2">Here’s the latest update about your loved one ❤️</p>
      </div>

      {/* Resident Info */}
      {resident ? (
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-50 p-4 rounded-full">
              <FiHeart className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{resident.name}</h2>
              <p className="text-gray-600 text-sm">
                DOB: {new Date(resident.dob).toLocaleDateString()}
              </p>
              <p className="text-gray-600 text-sm">Room No: {resident.roomNumber}</p>
              <p className="text-gray-600 text-sm">Medical: {resident.medicalHistory}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <FiUser className="w-12 h-12 mx-auto text-gray-400" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No resident linked yet
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            Please wait for admin approval to view your linked resident profile.
          </p>
        </div>
      )}

      {/* Health Snapshot */}
      {resident && resident.vitals && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary-50 p-4 rounded-lg shadow-md flex items-center space-x-4">
            <FiHeart className="w-8 h-8 text-primary-600" />
            <div>
              <h4 className="text-lg font-semibold text-primary-700">Heart Rate</h4>
              <p className="text-gray-600">{resident.vitals.heartRate} bpm</p>
            </div>
          </div>

          <div className="bg-primary-50 p-4 rounded-lg shadow-md flex items-center space-x-4">
            <FiThermometer className="w-8 h-8 text-primary-600" />
            <div>
              <h4 className="text-lg font-semibold text-primary-700">Temperature</h4>
              <p className="text-gray-600">{resident.vitals.temperature}</p>
            </div>
          </div>

          <div className="bg-primary-50 p-4 rounded-lg shadow-md flex items-center space-x-4">
            <FiActivity className="w-8 h-8 text-primary-600" />
            <div>
              <h4 className="text-lg font-semibold text-primary-700">Blood Pressure</h4>
              <p className="text-gray-600">{resident.vitals.bloodPressure}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/family/visits"
          className="bg-primary-50 p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-primary-100 transition-colors"
        >
          <div className="bg-primary-100 p-3 rounded-full">
            <FiClock className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-700">Request a Visit</h3>
            <p className="text-gray-600 text-sm">Schedule a visit to see your loved one</p>
          </div>
        </Link>

        <Link
          to="/family/shift-notes"
          className="bg-primary-50 p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-primary-100 transition-colors"
        >
          <div className="bg-primary-100 p-3 rounded-full">
            <FiHeart className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-700">View Shift Notes</h3>
            <p className="text-gray-600 text-sm">See how your resident is cared for</p>
          </div>
        </Link>
      </div>

      {/* Recent Updates */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Updates</h2>
        {recentUpdates.length > 0 ? (
          <ul className="space-y-3">
            {recentUpdates.map(update => (
              <li key={update.id} className="flex items-center space-x-4">
                <FiPlusCircle className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="text-gray-800 font-medium">{update.type}</p>
                  <p className="text-gray-500 text-xs">{update.time}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-sm">No recent updates available.</p>
        )}
      </div>
    </div>
  );
};

export default FamilyDashboard;
