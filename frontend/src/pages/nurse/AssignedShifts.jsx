import React, { useState, useEffect } from 'react'
import { FiFilter, FiSearch } from 'react-icons/fi'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ShiftCard from '../../components/common/ShiftCard'
import axiosInstance from '../../api/axiosInstance'
import { toast } from 'react-toastify'

const AssignedShifts = () => {
  const [loading, setLoading] = useState(true)
  const [shifts, setShifts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        // const response = await axiosInstance.get('/nurse/shifts')
        // setShifts(response.data)

        // Mock data
        setShifts([
          {
            id: 1,
            date: new Date(),
            startTime: '14:00',
            endTime: '22:00',
            status: 'scheduled',
            residentName: 'John Smith',
            residentRoom: '101',
            shiftType: 'afternoon'
          },
          {
            id: 2,
            date: new Date(),
            startTime: '06:00',
            endTime: '14:00',
            status: 'in-progress',
            residentName: 'Mary Johnson',
            residentRoom: '102',
            shiftType: 'morning',
            hasNotes: true
          },
          {
            id: 3,
            date: new Date(Date.now() - 86400000), // Yesterday
            startTime: '14:00',
            endTime: '22:00',
            status: 'completed',
            residentName: 'Robert Davis',
            residentRoom: '103',
            shiftType: 'afternoon',
            hasNotes: true
          }
        ])
        setLoading(false)
      } catch (error) {
        console.error('Error fetching shifts:', error)
        toast.error('Failed to load shifts')
        setLoading(false)
      }
    }

    fetchShifts()
  }, [])

  const handleStartShift = async (shiftId) => {
    try {
      // await axiosInstance.post(`/nurse/shifts/${shiftId}/start`)
      toast.success('Shift started successfully')
      // Update shifts list
      setShifts(shifts.map(shift =>
        shift.id === shiftId
          ? { ...shift, status: 'in-progress' }
          : shift
      ))
    } catch (error) {
      toast.error('Failed to start shift')
    }
  }

  const handleCompleteShift = async (shiftId) => {
    try {
      // await axiosInstance.post(`/nurse/shifts/${shiftId}/complete`)
      toast.success('Shift completed successfully')
      // Update shifts list
      setShifts(shifts.map(shift =>
        shift.id === shiftId
          ? { ...shift, status: 'completed' }
          : shift
      ))
    } catch (error) {
      toast.error('Failed to complete shift')
    }
  }

  const handleAddNotes = (shiftId) => {
    // Navigate to notes page or open modal
    toast.info('Opening notes editor...')
  }

  const handleViewNotes = (shiftId) => {
    // Navigate to view notes page or open modal
    toast.info('Opening shift notes...')
  }

  const filteredShifts = shifts
    .filter(shift => {
      const matchesSearch = shift.residentName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterStatus === 'all' || shift.status === filterStatus
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Shifts</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage your assigned shifts
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="form-input pl-10"
              placeholder="Search by resident name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="form-input pl-10"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Shifts</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shifts List */}
      <div className="space-y-4">
        {filteredShifts.map(shift => (
          <ShiftCard
            key={shift.id}
            shift={shift}
            onStart={handleStartShift}
            onComplete={handleCompleteShift}
            onAddNotes={handleAddNotes}
            onViewNotes={handleViewNotes}
          />
        ))}
        {filteredShifts.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg shadow-card">
            <p className="text-gray-500">No shifts found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AssignedShifts