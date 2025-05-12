import React, { useState, useEffect } from 'react'
import { FiSearch, FiFilter, FiClock, FiCalendar } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ShiftCard from '../../components/common/ShiftCard'
import { toast } from 'react-toastify'

const MyShifts = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [shifts, setShifts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        // Mock data using exact backend model fields
        setTimeout(() => {
          setShifts([
            {
              id: 1,
              date: new Date(),
              startTime: '07:00',
              endTime: '15:00',
              actualStartTime: null,
              actualEndTime: null,
              status: 'scheduled',
              residentName: 'John Smith',
              residentRoom: '101',
              shiftType: 'morning',
              hasNotes: false,
              resident: {
                _id: "6612resident123",
                name: "John Smith",
                dob: "1942-05-14",
                address: "12 Blue Street, Sydney",
                phone: "+61 412 345 678",
                medicalHistory: "Hypertension, Diabetes",
                files: [
                  { filename: "BloodTestReport.pdf", uploadedAt: "2024-05-01" }
                ]
              }
            },
            {
              id: 2,
              date: new Date(),
              startTime: '15:00',
              endTime: '23:00',
              actualStartTime: new Date().toISOString(),
              actualEndTime: null,
              status: 'in-progress',
              residentName: 'Mary Johnson',
              residentRoom: '102',
              shiftType: 'afternoon',
              hasNotes: true,
              resident: {
                _id: "6612resident124",
                name: "Mary Johnson",
                dob: "1945-08-22",
                address: "45 Green Avenue, Melbourne",
                phone: "+61 413 456 789",
                medicalHistory: "Arthritis, High Blood Pressure",
                files: [
                  { filename: "CarePlan2024.pdf", uploadedAt: "2024-04-15" }
                ]
              }
            },
            {
              id: 3,
              date: new Date(Date.now() - 86400000),
              startTime: '07:00',
              endTime: '15:00',
              actualStartTime: '2024-02-14T07:05:00Z',
              actualEndTime: '2024-02-14T15:10:00Z',
              status: 'completed',
              residentName: 'Robert Wilson',
              residentRoom: '103',
              shiftType: 'morning',
              hasNotes: true,
              resident: {
                _id: "6612resident125",
                name: "Robert Wilson",
                dob: "1938-11-30",
                address: "78 Red Road, Brisbane",
                phone: "+61 414 567 890",
                medicalHistory: "Dementia, Osteoporosis",
                files: []
              }
            }
          ])
          setLoading(false)
        }, 1000)
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
      const now = new Date().toISOString()
      setShifts(shifts.map(shift =>
        shift.id === shiftId ? { 
          ...shift, 
          status: 'in-progress',
          actualStartTime: now
        } : shift
      ))
      toast.success('Shift started successfully')
    } catch (error) {
      toast.error('Failed to start shift')
    }
  }

  const handleCompleteShift = async (shiftId) => {
    try {
      // await axiosInstance.post(`/nurse/shifts/${shiftId}/complete`)
      const now = new Date().toISOString()
      setShifts(shifts.map(shift =>
        shift.id === shiftId ? { 
          ...shift, 
          status: 'completed',
          actualEndTime: now
        } : shift
      ))
      toast.success('Shift completed successfully')
    } catch (error) {
      toast.error('Failed to complete shift')
    }
  }

  const handleAddNotes = (shift) => {
    // Pass the entire shift object through navigation
    navigate('/nurse/shift-notes', { 
      state: {
        id: shift.id,
        residentName: shift.residentName,
        residentRoom: shift.residentRoom,
        resident: shift.resident,
        date: shift.date,
        startTime: shift.startTime,
        endTime: shift.endTime,
        actualStartTime: shift.actualStartTime,
        actualEndTime: shift.actualEndTime,
        status: shift.status
      }
    })
  }

  const handleViewNotes = (shift) => {
    // Pass the entire shift object through navigation
    navigate('/nurse/shift-notes', { 
      state: {
        id: shift.id,
        residentName: shift.residentName,
        residentRoom: shift.residentRoom,
        resident: shift.resident,
        date: shift.date,
        startTime: shift.startTime,
        endTime: shift.endTime,
        actualStartTime: shift.actualStartTime,
        actualEndTime: shift.actualEndTime,
        status: shift.status,
        viewOnly: true
      }
    })
  }

  const filteredShifts = shifts.filter(shift => {
    const matchesSearch = shift.residentName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || shift.status === filterStatus
    
    let matchesDate = true
    if (dateRange.start && dateRange.end) {
      const shiftDate = new Date(shift.date)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      matchesDate = shiftDate >= startDate && shiftDate <= endDate
    }
    
    return matchesSearch && matchesFilter && matchesDate
  })

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Shifts</h1>
        <p className="mt-1 text-base text-gray-600">
          View and manage your assigned shifts
        </p>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Resident
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="form-input pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter resident name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shift Status
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="form-input pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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

          {/* Date Range */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                className="form-input pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                className="form-input pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
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
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <FiClock className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No shifts found</h3>
            <p className="mt-2 text-base text-gray-600">
              No shifts match your current filters.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyShifts