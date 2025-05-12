// src/pages/carer/Profile.jsx
import React, { useState, useContext } from 'react'
import { FiUser, FiPhone, FiMail, FiCamera, FiTrash2, FiLock } from 'react-icons/fi'
import { AuthContext } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { toast } from 'react-toastify'

const CarerProfile = () => {
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    profilePicture: user?.profilePicture || null,
    role: user?.role || 'carer'
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [imagePreview, setImagePreview] = useState(user?.profilePicture || null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setFormData(prev => ({ ...prev, profilePicture: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Profile updated successfully')
      setEditMode(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Password updated successfully')
      setShowPasswordModal(false)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error('Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <LoadingSpinner fullScreen />

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your account details</p>
      </div>

      {/* Profile Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-50 text-primary-600">
                    <FiUser className="w-12 h-12" />
                  </div>
                )}
              </div>

              <label htmlFor="upload" className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer">
                <FiCamera className="w-5 h-5 text-gray-600" />
                <input
                  type="file"
                  id="upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {imagePreview && (
              <button
                onClick={handleRemoveImage}
                className="text-sm text-red-500 hover:underline mt-3"
              >
                <FiTrash2 className="inline mr-1" /> Remove Photo
              </button>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="form-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  className="form-input pl-10"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="form-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Role</label>
              <input
                type="text"
                value={formData.role}
                className="form-input"
                disabled
              />
            </div>

            {/* Buttons */}
            {editMode ? (
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" color="white" /> : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="btn btn-outline"
              >
                Edit Profile
              </button>
            )}
          </form>

          {/* Password Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-md font-semibold text-gray-900">Password Settings</h2>
                <p className="text-sm text-gray-500">Change your login password</p>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="btn btn-outline text-sm"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                name="currentPassword"
                className="form-input"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                name="newPassword"
                className="form-input"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                name="confirmPassword"
                className="form-input"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" color="white" /> : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CarerProfile
