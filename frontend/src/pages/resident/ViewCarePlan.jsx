import React, { useState, useEffect } from 'react'
import { FiFileText } from 'react-icons/fi'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const ViewCarePlan = () => {
  const [loading, setLoading] = useState(true)
  const [carePlan, setCarePlan] = useState(null)
  const [resident, setResident] = useState(null)

  useEffect(() => {
    const fetchCarePlan = async () => {
      try {
        // Mock Care Plan Data
        setTimeout(() => {
          setCarePlan({
            title: 'Comprehensive Care Plan - John Smith',
            description: 'This care plan focuses on maintaining physical health, improving mental wellbeing, and ensuring safety for John Smith.',
            goals: [
              'Maintain mobility with daily exercises',
              'Monitor blood pressure and sugar levels',
              'Ensure balanced nutrition and hydration',
              'Encourage social interaction',
              'Improve sleep patterns'
            ],
            assignedStaff: [
              { name: 'Nurse Sarah Johnson', role: 'Primary Nurse' },
              { name: 'Carer Michael Chen', role: 'Support Carer' }
            ],
            lastUpdated: '2025-04-25'
          })
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching care plan:', error)
        setLoading(false)
      }
    }

    fetchCarePlan()
  }, [])

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (!carePlan) {
    return (
      <div className="text-center mt-10 text-gray-500">
        No Care Plan found.
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Care Plan</h1>
        <p className="text-gray-600">View your personal health and care goals</p>
      </div>

      {/* Care Plan Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <FiFileText className="text-primary-600 w-6 h-6" />
          <h2 className="text-lg font-semibold text-gray-900">{carePlan.title}</h2>
        </div>

        <p className="text-gray-700">{carePlan.description}</p>

        {/* Goals */}
        <div className="mt-6">
          <h3 className="text-md font-semibold text-gray-800 mb-2">Goals:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {carePlan.goals.map((goal, index) => (
              <li key={index}>{goal}</li>
            ))}
          </ul>
        </div>

        {/* Assigned Staff */}
        <div className="mt-6">
          <h3 className="text-md font-semibold text-gray-800 mb-2">Assigned Staff:</h3>
          <ul className="list-none space-y-1 text-gray-700">
            {carePlan.assignedStaff.map((staff, index) => (
              <li key={index}>
                <strong>{staff.name}</strong> - {staff.role}
              </li>
            ))}
          </ul>
        </div>

        {/* Last Updated */}
        <div className="mt-6 text-sm text-gray-500">
          Last Updated: {new Date(carePlan.lastUpdated).toLocaleDateString()}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
    <FiFileText className="text-primary-600" />
    My Uploaded Files
  </h2>

  {resident?.files?.length > 0 ? (
    <ul className="space-y-2">
      {resident.files.map((file, index) => (
        <li key={index} className="flex items-center justify-between border rounded px-4 py-2 hover:bg-gray-50">
          <span className="text-sm text-gray-700">{file.filename}</span>
          <button
            className="text-sm text-primary-600 hover:underline"
            onClick={() => window.open(`/uploads/residents/${file.filename}`, '_blank')}
          >
            View
          </button>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-gray-500">No files available.</p>
  )}
</div>

      </div>
    </div>
  )
}

export default ViewCarePlan
