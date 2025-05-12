import React, { useState, useContext } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { FiLock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'

const SetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { setPassword: setUserPassword } = useContext(AuthContext)
  
  // Password strength checker
  const checkPasswordStrength = (password) => {
    // At least 8 characters
    const isLongEnough = password.length >= 8
    
    // Has uppercase letter
    const hasUppercase = /[A-Z]/.test(password)
    
    // Has lowercase letter
    const hasLowercase = /[a-z]/.test(password)
    
    // Has number
    const hasNumber = /[0-9]/.test(password)
    
    // Has special character
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    
    // Calculate strength
    let strength = 0
    if (isLongEnough) strength++
    if (hasUppercase) strength++
    if (hasLowercase) strength++
    if (hasNumber) strength++
    if (hasSpecialChar) strength++
    
    return {
      score: strength,
      isValid: isLongEnough && (hasUppercase || hasLowercase) && (hasNumber || hasSpecialChar),
      feedback: {
        isLongEnough,
        hasUppercase,
        hasLowercase,
        hasNumber,
        hasSpecialChar
      }
    }
  }
  
  const passwordStrength = checkPasswordStrength(password)
  
  // Get strength indicator color
  const getStrengthColor = (score) => {
    switch (score) {
      case 0:
      case 1:
        return 'bg-red-500'
      case 2:
        return 'bg-orange-500'
      case 3:
        return 'bg-yellow-500'
      case 4:
        return 'bg-green-400'
      case 5:
        return 'bg-green-500'
      default:
        return 'bg-gray-300'
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validate token
    if (!token) {
      setError('Invalid or expired password reset link')
      return
    }
    
    // Validate password
    if (!passwordStrength.isValid) {
      setError('Password does not meet the requirements')
      return
    }
    
    // Check passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    try {
      setIsSubmitting(true)
      const result = await setUserPassword(token, password, confirmPassword)
      
      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.message || 'Failed to set password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">CareConnect</h2>
          </div>
          
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
              <div className="flex justify-center mb-4">
                <FiCheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Password Set Successfully</h2>
              <p className="text-gray-600 mb-6">Your password has been set. You can now sign in to your account.</p>
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">CareConnect</h2>
        </div>
        
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">Set Your Password</h2>
            
            {!token && (
              <div className="mb-4 flex items-center p-3 bg-red-50 text-red-800 rounded-md text-sm">
                <FiAlertCircle className="mr-2 flex-shrink-0" />
                <span>Invalid or expired password reset link. Please request a new one.</span>
              </div>
            )}
            
            {error && (
              <div className="mb-4 flex items-center p-3 bg-red-50 text-red-800 rounded-md text-sm">
                <FiAlertCircle className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="form-label">
                  New Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input pl-10"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                {/* Password strength meter */}
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-1 mb-1">
                      <div className={`h-1 flex-1 rounded-full ${password.length > 0 ? getStrengthColor(passwordStrength.score) : 'bg-gray-300'}`}></div>
                      <span className="text-xs text-gray-500">
                        {passwordStrength.score === 0 && "Very Weak"}
                        {passwordStrength.score === 1 && "Weak"}
                        {passwordStrength.score === 2 && "Fair"}
                        {passwordStrength.score === 3 && "Good"}
                        {passwordStrength.score === 4 && "Strong"}
                        {passwordStrength.score === 5 && "Very Strong"}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-2">
                      <p>Password must contain:</p>
                      <ul className="mt-1 space-y-1 list-inside">
                        <li className={`flex items-center ${passwordStrength.feedback.isLongEnough ? 'text-green-600' : 'text-gray-500'}`}>
                          <span className="mr-1">•</span> At least 8 characters
                        </li>
                        <li className={`flex items-center ${passwordStrength.feedback.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                          <span className="mr-1">•</span> At least one uppercase letter (A-Z)
                        </li>
                        <li className={`flex items-center ${passwordStrength.feedback.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                          <span className="mr-1">•</span> At least one lowercase letter (a-z)
                        </li>
                        <li className={`flex items-center ${passwordStrength.feedback.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                          <span className="mr-1">•</span> At least one number (0-9)
                        </li>
                        <li className={`flex items-center ${passwordStrength.feedback.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                          <span className="mr-1">•</span> At least one special character
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="form-label">
                  Confirm Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input pl-10"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                {password && confirmPassword && (
                  <p className={`mt-1 text-xs ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                    {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                  </p>
                )}
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !token || !passwordStrength.isValid || password !== confirmPassword}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <LoadingSpinner size="sm" color="white" />
                  ) : (
                    'Set Password'
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                Return to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetPassword