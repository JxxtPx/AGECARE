import React, { useState, useEffect } from 'react'
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import StatusBadge from '../../components/common/StatusBadge'
import { toast } from 'react-toastify'

const ManageCarePlans = () => {
  const [loading, setLoading] = useState(true)
  const [carePlans, setCarePlans] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [residents, setResidents] = useState([])
  
  // Form state using exact backend model fields
  const [formData, setFormData] = useState({
    resident: '',
    title: '',
    description: '',
    goals: '',
    startDate: '',
    endDate: '',
    status: 'active'
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data using exact backend model fields
        setTimeout(() => {
          setCarePlans([
            {
              _id: "6612careplan123",
              resident: {
                _id: "6612resident123",
                name: "Mary Smith"
              },
              title: "Post-Operative Recovery Plan",
              description: "Assist resident during recovery period after surgery.",
              goals: "Wound Care\nMobility Exercises\nMedication Monitoring",
              startDate: "2024-05-01",
              endDate: "2024-06-01",
              status: "active",
              createdAt: new Date().toISOString()
            },
            {
              _id: "6612careplan124",
              resident: {
                _id: "6612resident124",
                name: "John Doe"
              },
              title: "Diabetes Management Plan",
              description: "Daily monitoring and management of diabetes.",
              goals: "Blood Sugar Monitoring\nDiet Management\nFoot Care",
              startDate: "2024-04-15",
              endDate: "2024-07-15",
              status: "active",
              createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
              _id: "6612careplan125",
              resident: {
                _id: "6612resident125",
                name: "Robert Wilson"
              },
              title: "Physical Therapy Plan",
              description: "Rehabilitation exercises for improved mobility.",
              goals: "Strength Training\nBalance Exercises\nGait Training",
              startDate: "2024-03-01",
              endDate: "2024-04-01",
              status: "archived",
              createdAt: new Date(Date.now() - 172800000).toISOString()
            }
          ])

          setResidents([
            { _id: "6612resident123", name: "Mary Smith" },
            { _id: "6612resident124", name: "John Doe" },
            { _id: "6612resident125", name: "Robert Wilson" }
          ])

          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching care plans:', error)
        toast.error('Failed to load care plans')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCreatePlan = () => {
    setSelectedPlan(null)
    setFormData({
      resident: '',
      title: '',
      description: '',
      goals: '',
      startDate: '',
      endDate: '',
      status: 'active'
    })
    setShowModal(true)
  }

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan)
    setFormData({
      resident: plan.resident._id,
      title: plan.title,
      description: plan.description,
      goals: plan.goals,
      startDate: plan.startDate,
      endDate: plan.endDate,
      status: plan.status
    })
    setShowModal(true)
  }

  const handleDeletePlan = async (planId) => {
    if (window.confirm('Are you sure you want to delete this care plan?')) {
      try {
        // await axiosInstance.delete(`/coordinator/care-plans/${planId}`)
        setCarePlans(carePlans.filter(plan => plan._id !== planId))
        toast.success('Care plan deleted successfully')
      } catch (error) {
        toast.error('Failed to delete care plan')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (!formData.resident || !formData.title || !formData.startDate || !formData.endDate) {
        toast.error('Please fill in all required fields')
        return
      }

      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        toast.error('End date must be after start date')
        return
      }

      if (selectedPlan) {
        // await axiosInstance.put(`/coordinator/care-plans/${selectedPlan._id}`, formData)
        setCarePlans(carePlans.map(plan => 
          plan._id === selectedPlan._id 
            ? {
                ...plan,
                resident: residents.find(r => r._id === formData.resident),
                title: formData.title,
                description: formData.description,
                goals: formData.goals,
                startDate: formData.startDate,
                endDate: formData.endDate,
                status: formData.status
              }
            : plan
        ))
        toast.success('Care plan updated successfully')
      } else {
        // const response = await axiosInstance.post('/coordinator/care-plans', formData)
        const newPlan = {
          _id: Date.now().toString(),
          resident: residents.find(r => r._id === formData.resident),
          title: formData.title,
          description: formData.description,
          goals: formData.goals,
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status,
          createdAt: new Date().toISOString()
        }
        setCarePlans([...carePlans, newPlan])
        toast.success('Care plan created successfully')
      }

      setShowModal(false)
    } catch (error) {
      toast.error('Failed to save care plan')
    }
  }

  const filteredPlans = carePlans.filter(plan =>
    plan.resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Care Plans</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create and manage resident care plans
          </p>
        </div>
        <button
          onClick={handleCreatePlan}
          className="btn btn-primary"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Create New Care Plan
        </button>
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
            placeholder="Search residents or care plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Care Plans List */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resident
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Care Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPlans.map((plan) => (
                <tr key={plan._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {plan.resident.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {plan.title}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {plan.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(plan.startDate).toLocaleDateString()} -
                      {new Date(plan.endDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={plan.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditPlan(plan)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {selectedPlan ? 'Edit Care Plan' : 'Create New Care Plan'}
                      </h3>
                      <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="resident" className="block text-sm font-medium text-gray-700">
                          Resident
                        </label>
                        <select
                          id="resident"
                          className="mt-1 form-input"
                          value={formData.resident}
                          onChange={(e) => setFormData({ ...formData, resident: e.target.value })}
                          required
                        >
                          <option value="">Select resident</option>
                          {residents.map(resident => (
                            <option key={resident._id} value={resident._id}>
                              {resident.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Care Plan Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          className="mt-1 form-input"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          id="description"
                          rows={3}
                          className="mt-1 form-input"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>

                      <div>
                        <label htmlFor="goals" className="block text-sm font-medium text-gray-700">
                          Goals
                        </label>
                        <textarea
                          id="goals"
                          rows={4}
                          className="mt-1 form-input"
                          value={formData.goals}
                          onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                          placeholder="Enter goals, one per line"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            Start Date
                          </label>
                          <input
                            type="date"
                            id="startDate"
                            className="mt-1 form-input"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                            End Date
                          </label>
                          <input
                            type="date"
                            id="endDate"
                            className="mt-1 form-input"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          id="status"
                          className="mt-1 form-input"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          required
                        >
                          <option value="active">Active</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {selectedPlan ? 'Update Care Plan' : 'Create Care Plan'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageCarePlans