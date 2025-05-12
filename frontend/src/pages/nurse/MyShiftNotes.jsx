import React, { useState, useEffect } from 'react'
import { FiSearch, FiCalendar, FiEdit3, FiSave, FiArrowLeft, FiClock, FiUser, FiFileText, FiFilter, FiX } from 'react-icons/fi'
import { useLocation, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { toast } from 'react-toastify'

const MyShiftNotes = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [notes, setNotes] = useState([])
  const [currentShift, setCurrentShift] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })
  const [showModal, setShowModal] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [residents, setResidents] = useState([])
  const [selectedResident, setSelectedResident] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get shift data from navigation state
        const shiftData = location.state

        // If shift data exists, set current shift
        if (shiftData) {
          setCurrentShift(shiftData)
          setSelectedResident(shiftData.resident?._id || '')

          // Mock notes data for specific shift/resident
          const shiftNotes = [
            {
              _id: "6612note123",
              shiftId: shiftData.id,
              content: "Medication administered as scheduled. Vital signs stable.",
              category: "Medical",
              createdAt: new Date(Date.now() - 3600000).toISOString(),
              updatedAt: new Date(Date.now() - 3600000).toISOString(),
              residentName: shiftData.residentName,
              date: shiftData.date,
              shift: {
                startTime: shiftData.startTime,
                endTime: shiftData.endTime,
                type: shiftData.shiftType
              }
            }
          ]

          setNotes(shiftNotes)
        } else {
          // Mock residents data
          const mockResidents = [
            {
              _id: "6612resident123",
              name: "John Smith",
              room: "101"
            },
            {
              _id: "6612resident124",
              name: "Mary Johnson",
              room: "102"
            }
          ]

          setResidents(mockResidents)

          // Mock notes data for all shifts
          const allNotes = [
            {
              _id: "6612note123",
              shiftId: "shift1",
              content: "Morning medication administered. Patient comfortable.",
              category: "Medical",
              createdAt: new Date(Date.now() - 3600000).toISOString(),
              updatedAt: new Date(Date.now() - 3600000).toISOString(),
              residentName: "John Smith",
              date: new Date().toISOString(),
              shift: {
                startTime: "07:00",
                endTime: "15:00",
                type: "morning"
              }
            },
            {
              _id: "6612note124",
              shiftId: "shift2",
              content: "Evening vital signs checked. All parameters normal.",
              category: "Medical",
              createdAt: new Date(Date.now() - 7200000).toISOString(),
              updatedAt: new Date(Date.now() - 7200000).toISOString(),
              residentName: "Mary Johnson",
              date: new Date(Date.now() - 86400000).toISOString(),
              shift: {
                startTime: "15:00",
                endTime: "23:00",
                type: "afternoon"
              }
            }
          ]

          setNotes(allNotes)
        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load notes')
        setLoading(false)
      }
    }

    fetchData()
  }, [location.state])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!noteText.trim()) {
      toast.error('Please enter note content')
      return
    }

    try {
      setSubmitting(true)

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Add new note to list
      const newNote = {
        _id: Date.now().toString(),
        shiftId: currentShift?.id || 'new',
        content: noteText,
        category: 'Medical',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        residentName: currentShift?.residentName || 'New Note',
        date: currentShift?.date || new Date().toISOString(),
        shift: currentShift ? {
          startTime: currentShift.startTime,
          endTime: currentShift.endTime,
          type: currentShift.shiftType
        } : null
      }

      setNotes([newNote, ...notes])
      setNoteText('')
      toast.success('Note added successfully')
    } catch (error) {
      toast.error('Failed to save note')
    } finally {
      setSubmitting(false)
    }
  }

  const handleViewNote = (note) => {
    setSelectedNote(note)
    setShowModal(true)
  }

  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.residentName.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesDate = true
    if (dateRange.start && dateRange.end) {
      const noteDate = new Date(note.date)
      const start = new Date(dateRange.start)
      const end = new Date(dateRange.end)
      matchesDate = noteDate >= start && noteDate <= end
    }

    // Filter by selected resident if on main notes page
    const matchesResident = currentShift ? true : !selectedResident || note.residentName === residents.find(r => r._id === selectedResident)?.name
    
    return matchesSearch && matchesDate && matchesResident
  })

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {currentShift && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Back to Shifts
            </button>
          )}
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            {currentShift ? 'Shift Notes' : 'All Shift Notes'}
          </h1>
          {currentShift && (
            <p className="mt-1 text-sm text-gray-600">
              {currentShift.residentName} - {new Date(currentShift.date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="form-input pl-10"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {!currentShift && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="form-input pl-10"
                value={selectedResident}
                onChange={(e) => setSelectedResident(e.target.value)}
              >
                <option value="">All Residents</option>
                {residents.map(resident => (
                  <option key={resident._id} value={resident._id}>
                    {resident.name} - Room {resident.room}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              className="form-input pl-10"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              className="form-input pl-10"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredNotes.map(note => (
            <div
              key={note._id}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleViewNote(note)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {note.residentName}
                  </h3>
                  {note.shift && (
                    <div className="flex items-center mt-1 space-x-2 text-sm text-gray-500">
                      <FiClock className="w-4 h-4" />
                      <span>{note.shift.startTime} - {note.shift.endTime}</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs capitalize">
                        {note.shift.type} Shift
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(note.createdAt).toLocaleString()}
                </span>
              </div>
              
              <div className="mt-2">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {note.content}
                </p>
              </div>
            </div>
          ))}

          {filteredNotes.length === 0 && (
            <div className="text-center py-8">
              <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notes found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || dateRange.start || dateRange.end ? 
                  'Try adjusting your search or filters' : 
                  'Start by adding a new note'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* View Note Modal */}
      {showModal && selectedNote && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {selectedNote.residentName}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {new Date(selectedNote.date).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                      {selectedNote.shift && (
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                          <div className="flex items-center space-x-2">
                            <FiClock className="w-4 h-4" />
                            <span>{selectedNote.shift.startTime} - {selectedNote.shift.endTime}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs capitalize">
                            {selectedNote.shift.type} Shift
                          </span>
                        </div>
                      )}
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                        {selectedNote.content}
                      </p>
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                      <p>Created: {new Date(selectedNote.createdAt).toLocaleString()}</p>
                      <p>Last Updated: {new Date(selectedNote.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Form */}
      {(!currentShift || !currentShift.viewOnly) && (
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Note</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!currentShift && (
              <div>
                <label htmlFor="resident" className="block text-sm font-medium text-gray-700">
                  Resident
                </label>
                <select
                  id="resident"
                  className="mt-1 form-input"
                  value={selectedResident}
                  onChange={(e) => setSelectedResident(e.target.value)}
                  required
                >
                  <option value="">Select Resident</option>
                  {residents.map(resident => (
                    <option key={resident._id} value={resident._id}>
                      {resident.name} - Room {resident.room}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="noteText" className="block text-sm font-medium text-gray-700">
                Note Content
              </label>
              <textarea
                id="noteText"
                rows={4}
                className="mt-1 form-input"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter your note here..."
                required
              />
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
                  <>
                    <FiSave className="w-4 h-4 mr-2" />
                    Save Note
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default MyShiftNotes