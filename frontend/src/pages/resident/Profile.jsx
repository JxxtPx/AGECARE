import React, { useContext } from 'react';
import { FiUser, FiPhone, FiMail, FiCalendar, FiHome, FiFileText } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ResidentProfile = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading || !user) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="bg-primary-100 text-primary-600 p-3 rounded-full">
          <FiUser className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 text-sm">
            View your personal and medical information.
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">

        {/* Profile Picture */}
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary-50 text-primary-600 text-5xl font-bold">
                {user.firstName?.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiUser className="mr-2" /> Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <FiUser className="text-primary-600" />
              <span className="text-gray-700">{user.firstName} {user.lastName}</span>
            </div>
            <div className="flex items-center space-x-3">
              <FiMail className="text-primary-600" />
              <span className="text-gray-700">{user.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <FiPhone className="text-primary-600" />
              <span className="text-gray-700">{user.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <FiCalendar className="text-primary-600" />
              <span className="text-gray-700">{user.dob ? user.dob : 'Not provided'}</span>
            </div>
            <div className="flex items-center space-x-3 md:col-span-2">
              <FiHome className="text-primary-600" />
              <span className="text-gray-700">{user.address || 'Not provided'}</span>
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiFileText className="mr-2" /> Medical Information
          </h2>

          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {user.medicalHistory && user.medicalHistory.length > 0 ? (
              user.medicalHistory.map((condition, idx) => (
                <li key={idx}>{condition}</li>
              ))
            ) : (
              <li>No medical history available.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResidentProfile;
