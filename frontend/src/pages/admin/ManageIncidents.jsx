import React, { useState, useEffect } from 'react'
import { FiSearch, FiFilter, FiAlertCircle, FiX, FiEye, FiCheck } from 'react-icons/fi'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import StatusBadge from '../../components/common/StatusBadge'
import { toast } from 'react-toastify'
import axiosInstance from '../../api/axiosInstance'

const ManageIncidents = () => {
  const [loading, setLoading] = useState(true)
  const [incidents, setIncidents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState(null)
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const { data } = await axiosInstance.get("/shared/incidents")
        console.log("Fetched incidents", data)
        setIncidents(data)
      } catch (error) {
        console.error('Error fetching incidents:', error)
        toast.error('Failed to load incidents')
      } finally {
        setLoading(false)  // ✅ ensure loading state is updated regardless
      }
    }
  
    fetchIncidents()
  }, [])
  

  const handleViewIncident = (incident) => {
    setSelectedIncident(incident)
    setShowModal(true)
  }

  const handleCloseIncident = async (incidentId) => {
    try {
      await axiosInstance.put(`/shared/incidents/${incidentId}`)

      setIncidents(incidents.map(incident =>
        incident._id === incidentId
          ? { ...incident, status: 'closed' }
          : incident
      ))
      toast.success('Incident marked as closed')
    } catch (error) {
      toast.error('Failed to update incident status')
    }
  }

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = 
      incident.reportedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.resident.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || incident.status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Incident Reports</h1>
        <p className="mt-1 text-sm text-gray-600">
          Review and manage reported incidents
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="form-input pl-10"
              placeholder="Search by reporter, resident, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="form-input pl-10"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incidents List */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resident
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIncidents.map((incident) => (
                <tr key={incident._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                    {incident.reportedBy?.name || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                    {incident.reportedBy?.role || 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                    {incident.resident?.fullName || 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-2">
                      {incident.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={incident.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(incident.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewIncident(incident)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    {incident.status === 'open' && (
                      <button
                        onClick={() => handleCloseIncident(incident._id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <FiCheck className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredIncidents.length === 0 && (
            <div className="text-center py-8">
              <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No incidents found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No incidents match your current filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* View Incident Modal */}
      {showModal && selectedIncident && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Incident Details
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
                        <h4 className="text-sm font-medium text-gray-900">Reporter</h4>
                        <p className="mt-1 text-sm text-gray-600">
                        {selectedIncident.reportedBy?.name || 'Unknown'} ({selectedIncident.reportedBy?.role || 'Unknown'})

                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Resident</h4>
                        <p className="mt-1 text-sm text-gray-600">
                        {selectedIncident.resident?.fullName || 'Unknown'}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Description</h4>
                        <p className="mt-1 text-sm text-gray-600">
                          {selectedIncident.description}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Status</h4>
                        <div className="mt-1">
                          <StatusBadge status={selectedIncident.status} />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Date Reported</h4>
                        <p className="mt-1 text-sm text-gray-600">
                          {new Date(selectedIncident.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedIncident.status === 'open' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseIncident(selectedIncident._id)
                      setShowModal(false)
                    }}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Mark as Closed
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
  )
}

export default ManageIncidents