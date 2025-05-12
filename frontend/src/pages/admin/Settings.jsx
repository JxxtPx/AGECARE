import React, { useState, useContext } from 'react'
import { FiLock, FiPhone, FiMail, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import axiosInstance from '../../api/axiosInstance'

const Settings = () => {
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  // Contact form state - using exact backend model fields
  const [contactForm, setContactForm] = useState({
    email: user?.email || '',
    phone: user?.phone || ''
  })
  
  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    passwordsMatch: false
  })
  
  const validatePassword = (password) => {
    return {
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }
  }
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (name === 'newPassword') {
      const validation = validatePassword(value)
      setPasswordValidation(prev => ({
        ...validation,
        passwordsMatch: value === passwordForm.confirmPassword
      }))
    }
    
    if (name === 'confirmPassword') {
      setPasswordValidation(prev => ({
        ...prev,
        passwordsMatch: value === passwordForm.newPassword
      }))
    }
  }
  
  const handleContactChange = (e) => {
    const { name, value } = e.target
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill in all password fields')
      return
    }
    
    if (!passwordValidation.passwordsMatch) {
      toast.error('New passwords do not match')
      return
    }
    
    const validation = validatePassword(passwordForm.newPassword)
    if (!Object.values(validation).every(Boolean)) {
      toast.error('New password does not meet requirements')
      return
    }
    
    try {
      setLoading(true)
      // Will be replaced with real API call
      // await axiosInstance.put('/admin/settings/password', {
      //   currentPassword: passwordForm.currentPassword,
      //   newPassword: passwordForm.newPassword
      // })
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Password updated successfully')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      toast.error('Failed to update password')
    } finally {
      setLoading(false)
    }
  }
  
  const handleContactSubmit = async (e) => {
    e.preventDefault()
    
    if (!contactForm.email || !contactForm.phone) {
      toast.error('Please fill in all contact fields')
      return
    }
    
    try {
      setLoading(true)
      // Will be replaced with real API call
      // await axiosInstance.put('/admin/settings/contact', contactForm)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Contact information updated successfully')
    } catch (error) {
      toast.error('Failed to update contact information')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change Password */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="form-input pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="form-input pl-10"
                  placeholder="••••••••"
                />
              </div>
              
              {/* Password Requirements */}
              {passwordForm.newPassword && (
                <div className="mt-2 text-xs space-y-1">
                  <p className="font-medium text-gray-700">Password requirements:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    <div className={`flex items-center ${passwordValidation.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordValidation.hasMinLength ? <FiCheckCircle className="mr-1" /> : <FiAlertCircle className="mr-1" />}
                      At least 8 characters
                    </div>
                    <div className={`flex items-center ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordValidation.hasUpperCase ? <FiCheckCircle className="mr-1" /> : <FiAlertCircle className="mr-1" />}
                      One uppercase letter
                    </div>
                    <div className={`flex items-center ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordValidation.hasLowerCase ? <FiCheckCircle className="mr-1" /> : <FiAlertCircle className="mr-1" />}
                      One lowercase letter
                    </div>
                    <div className={`flex items-center ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordValidation.hasNumber ? <FiCheckCircle className="mr-1" /> : <FiAlertCircle className="mr-1" />}
                      One number
                    </div>
                    <div className={`flex items-center ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordValidation.hasSpecialChar ? <FiCheckCircle className="mr-1" /> : <FiAlertCircle className="mr-1" />}
                      One special character
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="form-input pl-10"
                  placeholder="••••••••"
                />
              </div>
              
              {passwordForm.confirmPassword && (
                <p className={`mt-1 text-xs ${passwordValidation.passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordValidation.passwordsMatch ? (
                    <span className="flex items-center">
                      <FiCheckCircle className="mr-1" />
                      Passwords match
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FiAlertCircle className="mr-1" />
                      Passwords do not match
                    </span>
                  )}
                </p>
              )}
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
        
        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleContactChange}
                  className="form-input pl-10"
                  placeholder="+61 412 345 678"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  className="form-input pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary"
              >
                Update Contact Info
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Settings