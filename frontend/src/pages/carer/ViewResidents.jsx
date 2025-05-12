import React, { useState, useEffect } from 'react'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { toast } from 'react-toastify'

const ViewResidents = () => {
  const [loading, setLoading] = useState(true)
  const [residents, setResidents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedResident, setSelectedResident] = useState(null)

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        // Mock data using exact backend model fields
        setTimeout(() => {
          setResidents([
            {
              _id: "6612resident123",
              name: "Mary Smith",
              dob: "1942-05-14",
              address: "12 Blue Street, Sydney",
              phone: "+61 412 345 678",
              medicalHistory: "Hypertension, Diabetes",
              files: [
                { filename: "BloodTestReport.pdf", uploadedAt: "2024-05-01" }
              ]
            },
            {
              _id: "6612resident124",
              name: "John Doe",
              dob: "1945-08-22",
              address: "45 Green Avenue, Melbourne",
              phone: "+61 413 456 789",
              medicalHistory: "Arthritis, High Blood Pressure",
              files: [
                { filename: "CarePlan2024.pdf", uploadedAt: "2024-04-15" }
              ]
            },
            {
              _id: "6612resident125",
              name: "Robert Wilson",
              dob: "1938-11-30",
              address: "78 Red Road, Brisbane",
              phone: "+61 414 567 890",
              medicalHistory: "Dementia, Osteoporosis",
              files: []
            }
          ])
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching residents:', error)
        toast.error('Failed to load residents')
        setLoading(false)
      }
    }

    fetchResidents()
  }, [])

  const handleViewResident = (resident) => {
    setSelectedResident(resident)
    setShowModal(true)
  }

  const calculateAge = (dob) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const filteredResidents = residents.filter(resident =>
    resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.medicalHistory.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">View Residents</h1>
        <p className="mt-1 text-sm text-gray-600">
          View detailed information about residents
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-card">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input pl-10"
            placeholder="Search by name or medical conditions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Residents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResidents.map(resident => (
          <div
            key={resident._id}
            className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-200 cursor-pointer"
            onClick={() => handleViewResident(resident)}
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {resident.name}
                </h3>
                <span className="text-sm text-gray-500">
                  Age: {calculateAge(resident.dob)}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {resident.address}
              </p>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900">Medical Conditions:</h4>
                <p className="mt-1 text-sm text-gray-600">
                  {resident.medicalHistory}
                </p>
              </div>
              {resident.files.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500">
                    {resident.files.length} file(s) available
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Resident Details Modal */}
      {showModal && selectedResident && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Resident Details
                      </h3>
                      <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Full Name</h4>
                        <p className="mt-1 text-sm text-gray-900">{selectedResident.name}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Date of Birth</h4>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(selectedResident.dob).toLocaleDateString()} (Age: {calculateAge(selectedResident.dob)})
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Contact Information</h4>
                        <p className="mt-1 text-sm text-gray-900">{selectedResident.phone}</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedResident.address}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Medical History</h4>
                        <p className="mt-1 text-sm text-gray-900">{selectedResident.medicalHistory}</p>
                      </div>

                      {selectedResident.files.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Available Files</h4>
                          <ul className="mt-2 divide-y divide-gray-200">
                            {selectedResident.files.map((file, index) => (
                              <li key={index} className="py-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-900">{file.filename}</span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(file.uploadedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewResidents