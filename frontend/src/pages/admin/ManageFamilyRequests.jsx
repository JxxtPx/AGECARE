import React, { useState, useEffect } from 'react'
import { FiCheckCircle, FiXCircle, FiUser } from 'react-icons/fi'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { toast } from 'react-toastify'

const ManageFamilyRequests = () => {
  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState([])

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setRequests([
            {
              id: 1,
              fullName: 'John Doe',
              email: 'john.doe@example.com',
              phone: '+61 412 345 678',
              createdAt: new Date().toISOString()
            },
            {
              id: 2,
              fullName: 'Mary Smith',
              email: 'mary.smith@example.com',
              phone: '+61 413 456 789',
              createdAt: new Date(Date.now() - 86400000).toISOString()
            }
          ])
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching family requests:', error)
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const handleAccept = (requestId) => {
    setRequests(prev => prev.filter(r => r.id !== requestId))
    toast.success('Family request accepted successfully')
  }

  const handleReject = (requestId) => {
    setRequests(prev => prev.filter(r => r.id !== requestId))
    toast.error('Family request rejected')
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Family Requests</h1>
        <p className="mt-1 text-base text-gray-600">
          Review and approve or reject new family account requests
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        {requests.length === 0 ? (
          <div className="text-center py-20">
            <FiUser className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No pending requests</h3>
            <p className="mt-2 text-base text-gray-600">All family signup requests have been reviewed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Signup Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleAccept(req.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FiCheckCircle className="inline-block w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiXCircle className="inline-block w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageFamilyRequests
