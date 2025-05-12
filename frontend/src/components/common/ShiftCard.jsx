import React, { useState } from 'react'
import { FiClock, FiCalendar, FiUser, FiChevronDown, FiChevronUp, FiFile, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import StatusBadge from './StatusBadge'
import LoadingSpinner from './LoadingSpinner'

const ShiftCard = ({ 
  shift, 
  onStart = null, 
  onComplete = null,
  onAddNotes = null,
  onViewNotes = null,
  compact = false
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showResidentInfo, setShowResidentInfo] = useState(false)
  
  const { 
    id, 
    date, 
    startTime, 
    endTime,
    actualStartTime,
    actualEndTime, 
    status, 
    residentName, 
    residentRoom,
    shiftType,
    hasNotes,
    resident
  } = shift
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return ''
    
    const options = { hour: 'numeric', minute: 'numeric', hour12: true }
    
    // If timeString is already a Date object
    if (timeString instanceof Date) {
      return timeString.toLocaleTimeString(undefined, options)
    }
    
    // If timeString is a string in HH:MM format
    if (typeof timeString === 'string' && timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':').map(num => parseInt(num, 10))
      const date = new Date()
      date.setHours(hours)
      date.setMinutes(minutes)
      return date.toLocaleTimeString(undefined, options)
    }
    
    // If timeString is an ISO string
    if (typeof timeString === 'string' && timeString.includes('T')) {
      return new Date(timeString).toLocaleTimeString(undefined, options)
    }
    
    return timeString
  }
  
  // Determine shift background color
  const getShiftBgColor = () => {
    switch(status) {
      case 'completed':
        return 'bg-green-50 border-green-200'
      case 'in-progress':
        return 'bg-blue-50 border-blue-200'
      case 'missed':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-white border-gray-200'
    }
  }
  
  // Determine shift type label
  const getShiftTypeLabel = () => {
    switch(shiftType?.toLowerCase()) {
      case 'morning':
        return { text: 'Morning Shift', color: 'bg-yellow-100 text-yellow-800' }
      case 'afternoon':
        return { text: 'Afternoon Shift', color: 'bg-orange-100 text-orange-800' }
      case 'night':
        return { text: 'Night Shift', color: 'bg-indigo-100 text-indigo-800' }
      default:
        return { text: shiftType || 'Regular Shift', color: 'bg-gray-100 text-gray-800' }
    }
  }

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return null
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }
  
  const shiftTypeInfo = getShiftTypeLabel()
  
  const handleStartShift = async () => {
    try {
      setIsLoading(true)
      await onStart(id)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteShift = async () => {
    try {
      setIsLoading(true)
      await onComplete(id)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className={`rounded-xl border ${getShiftBgColor()} shadow-lg hover:shadow-xl transition-all duration-300 p-5`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${shiftTypeInfo.color}`}>
              {shiftTypeInfo.text}
            </span>
            <StatusBadge status={status} size="md" />
          </div>
          
          <button 
            onClick={() => setShowResidentInfo(!showResidentInfo)}
            className="mt-3 flex items-center space-x-2 group"
          >
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600">
              {residentName}
            </h3>
            {showResidentInfo ? (
              <FiChevronUp className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
            ) : (
              <FiChevronDown className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
            )}
          </button>
          
          {residentRoom && (
            <p className="text-base text-gray-600 mt-1">Room {residentRoom}</p>
          )}
        </div>
        
        {hasNotes && (
          <div className="bg-primary-50 text-primary-700 text-sm px-3 py-1.5 rounded-full font-medium">
            Has Notes
          </div>
        )}
      </div>
      
      {/* Resident Information Dropdown */}
      {showResidentInfo && resident && (
        <div className="mt-4 bg-gray-50 rounded-xl p-5 space-y-4 border border-gray-200">
          <div>
            <h4 className="text-sm font-semibold text-gray-700">Personal Information</h4>
            <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
              <p className="text-gray-600">Age: {calculateAge(resident.dob)}</p>
              <p className="text-gray-600">Phone: {resident.phone}</p>
            </div>
            <p className="text-sm text-gray-600 mt-2">Address: {resident.address}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-700">Medical History</h4>
            <p className="mt-2 text-sm text-gray-600">{resident.medicalHistory}</p>
          </div>
          
          {resident.files && resident.files.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700">Available Files</h4>
              <ul className="mt-2 space-y-2">
                {resident.files.map((file, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <FiFile className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{file.filename}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({new Date(file.uploadedAt).toLocaleDateString()})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4 space-y-2.5">
        <div className="flex items-center text-sm text-gray-600">
          <FiCalendar className="mr-2 text-gray-400" />
          <span>{formatDate(date)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <FiClock className="mr-2 text-gray-400" />
          <span>Scheduled: {formatTime(startTime)} - {formatTime(endTime)}</span>
        </div>
        
        {actualStartTime && (
          <div className="flex items-center text-sm text-green-600">
            <FiCheckCircle className="mr-2 text-green-500" />
            <span>Started at: {formatTime(actualStartTime)}</span>
          </div>
        )}
        
        {actualEndTime && (
          <div className="flex items-center text-sm text-green-600">
            <FiCheckCircle className="mr-2 text-green-500" />
            <span>Completed at: {formatTime(actualEndTime)}</span>
          </div>
        )}
      </div>
      
      {!compact && (
        <div className="mt-5 flex flex-wrap gap-3">
          {status === 'scheduled' && onStart && (
            <button 
              onClick={handleStartShift}
              disabled={isLoading}
              className="flex-1 btn bg-primary-600 hover:bg-primary-700 text-white text-base py-2 font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? <LoadingSpinner size="sm" color="white" /> : (
                <>
                  <FiClock className="w-5 h-5 mr-2" />
                  Start Shift
                </>
              )}
            </button>
          )}
          
          {status === 'in-progress' && onComplete && (
            <button 
              onClick={handleCompleteShift}
              disabled={isLoading}
              className="flex-1 btn bg-green-600 hover:bg-green-700 text-white text-base py-2 font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? <LoadingSpinner size="sm" color="white" /> : (
                <>
                  <FiCheckCircle className="w-5 h-5 mr-2" />
                  Complete Shift
                </>
              )}
            </button>
          )}
          
          {status === 'in-progress' && onAddNotes && (
            <button 
              onClick={() => onAddNotes(shift)}
              className="flex-1 btn bg-white hover:bg-gray-50 text-gray-700 text-base py-2 font-medium rounded-lg border border-gray-300 transition-all duration-200 flex items-center justify-center"
            >
              <FiFile className="w-5 h-5 mr-2" />
              Add Notes
            </button>
          )}
          
          {status === 'completed' && onViewNotes && (
            <button 
              onClick={() => onViewNotes(shift)}
              className="flex-1 btn bg-white hover:bg-gray-50 text-gray-700 text-base py-2 font-medium rounded-lg border border-gray-300 transition-all duration-200 flex items-center justify-center"
            >
              <FiFile className="w-5 h-5 mr-2" />
              View Notes
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ShiftCard