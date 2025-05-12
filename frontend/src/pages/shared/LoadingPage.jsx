import React from 'react'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const LoadingPage = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  )
}

export default LoadingPage