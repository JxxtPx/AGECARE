import React, { useState, useEffect, useContext } from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import { AuthContext } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { toast } from 'react-toastify'

const ReportIncidents = () => {
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [residents, setResidents] = useState([])
  
  // Form state using exact backend model fields
  const [formData, setFormData] = useState({
    resident: '',
    description: '',
    reportedAt: new Date().toISOString().slice(0, 16) // Current date-time in format YYYY-MM-DDTHH:mm
  })

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        // Mock data
        setTimeout(() => {
          setResidents([
            { _id: "6612resident123", name: "Sarah Lee" },
            { _id: "6612resident124", name: "John Smith" },
            { _id: "6612resident125", name: "Mary Johnson" }
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.resident || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)

      // Mock API call - will be replaced with real endpoint
      // const response = await axiosInstance.post('/carer/incidents', {
      //   residentId: formData.resident,
      //   description: formData.description,
      //   reportedAt: formData.reportedAt
      // })

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success('Incident reported successfully')
      
      // Reset form
      setFormData({
        resident: '',
        description: '',
        reportedAt: new Date().toISOString().slice(0, 16)
      })
    } catch (error) {
      toast.error('Failed to report incident')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Report Incident</h1>
        <p className="mt-1 text-sm text-gray-600">
          Report any incidents or concerns regarding residents
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <label htmlFor="reportedAt" className="block text-sm font-medium text-gray-700">
              Date & Time
            </label>
            <input
              type="datetime-local"
              id="reportedAt"
              className="mt-1 form-input"
              value={formData.reportedAt}
              onChange={(e) => setFormData({ ...formData, reportedAt: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                rows={4}
                className="form-input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the incident in detail..."
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Please provide as much detail as possible about the incident.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Important Note
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    This incident report will be immediately sent to the coordinator for review.
                    Please ensure all information is accurate and complete.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReportIncidents