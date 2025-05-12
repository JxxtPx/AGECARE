import React, { useState, useEffect } from 'react';
import { FiUser, FiPhone, FiMapPin, FiCalendar, FiFileText } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ViewResidentFamily = () => {
  const [loading, setLoading] = useState(true);
  const [resident, setResident] = useState(null);

  useEffect(() => {
    const fetchResident = async () => {
      try {
        // Mock resident data
        setTimeout(() => {
          setResident({
            id: 'res123',
            name: 'John Smith',
            dob: '1942-05-14',
            phone: '+61 412 345 678',
            address: '12 Blue Street, Sydney',
            medicalHistory: 'Hypertension, Diabetes, Arthritis',
            files: [
              { filename: 'BloodTestReport.pdf', uploadedAt: '2024-05-01' },
              { filename: 'MRIReport2024.pdf', uploadedAt: '2024-03-15' },
            ],
          });
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

  if (!resident) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Resident Profile</h2>
        <p className="mt-2 text-gray-600">No resident profile available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resident Profile</h1>
        <p className="text-gray-600">Here’s the profile of your loved one</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <FiUser className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{resident.name}</h2>
              <p className="text-gray-600 text-sm">DOB: {new Date(resident.dob).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <FiPhone className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-800">Phone</h3>
              <p className="text-gray-600 text-sm">{resident.phone}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <FiMapPin className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-800">Address</h3>
              <p className="text-gray-600 text-sm">{resident.address}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <FiCalendar className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-800">Medical History</h3>
              <p className="text-gray-600 text-sm">{resident.medicalHistory}</p>
            </div>
          </div>
        </div>

        {/* Uploaded Files */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Resident Files</h2>
          {resident.files.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {resident.files.map((file, index) => (
                <li key={index} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FiFileText className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-gray-800 font-medium">{file.filename}</p>
                      <p className="text-gray-500 text-xs">
                        Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button className="btn btn-outline-primary text-sm">
                    View File
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-sm">No files uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewResidentFamily;
