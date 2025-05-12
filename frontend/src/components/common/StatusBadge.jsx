import React from 'react'

const StatusBadge = ({ status, size = 'md' }) => {
  // Determine color based on status
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case 'active':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          dotColor: 'bg-green-500'
        }
      case 'inactive':
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          dotColor: 'bg-gray-500'
        }
      case 'pending':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          dotColor: 'bg-yellow-500'
        }
      case 'completed':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          dotColor: 'bg-blue-500'
        }
      case 'cancelled':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          dotColor: 'bg-red-500'
        }
      case 'approved':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          dotColor: 'bg-green-500'
        }
      case 'rejected':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          dotColor: 'bg-red-500'
        }
      case 'critical':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          dotColor: 'bg-red-500'
        }
      case 'warning':
        return {
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
          dotColor: 'bg-orange-500'
        }
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          dotColor: 'bg-gray-500'
        }
    }
  }
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm'
  }
  
  const { bgColor, textColor, dotColor } = getStatusConfig()
  const sizeClass = sizeClasses[size] || sizeClasses.md
  
  return (
    <span className={`inline-flex items-center rounded-full ${bgColor} ${textColor} ${sizeClass} font-medium`}>
      <span className={`mr-1.5 h-2 w-2 rounded-full ${dotColor}`}></span>
      <span className="capitalize">{status}</span>
    </span>
  )
}

export default StatusBadge