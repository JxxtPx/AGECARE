import React, { useState, useEffect } from 'react'
import { FiSearch, FiFilter, FiFlag, FiAlertCircle, FiCheck, FiX } from 'react-icons/fi'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import StatusBadge from '../../components/common/StatusBadge'
import { toast } from 'react-toastify'

const FlagShiftNotes = () => {
  const [loading, setLoading] = useState(true)
  const [flaggedNotes, setFlaggedNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [escalationComment, setEscalationComment] = useState('')

  useEffect(() => {
    const fetchFlaggedNotes = async () => {
      try {
        // Mock data using exact backend model fields
        setTimeout(() => {
          setFlaggedNotes([
            {
              _id: "6612flaggednote123",
              resident: {
                _id: "6612resident789",
                name: "Robert James"
              },
              noteText: "Resident felt dizzy after afternoon medication.",
              shiftDate: "2024-05-10",
              flaggedBy: {
                _id: "6612nurse123",
                name: "Sarah Nurse",
                role: "nurse"
              },
              flagComment: "Possible medication side effect.",
              status: "pending",
              createdAt: new Date().toISOString()
            },
            {
              _id: "6612flaggednote124",
              resident: {
                _id: "6612resident790",
                name: "Mary Wilson"
              },
              noteText: "Noticeable changes in appetite and mood during evening shift.",
              shiftDate: "2024-05-09",
              flaggedBy: {
                _id: "6612carer123",
                name: "John Carer",
                role: "carer"
              },
              flagComment: "Behavioral change needs assessment.",
              status: "reviewed",
              createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
              _id: "6612flaggednote125",
              resident: {
                _id: "6612resident791",
                name: "David Brown"
              },
              noteText: "Resident complained of persistent joint pain during morning activities.",
              shiftDate: "2024-05-08",
              flaggedBy: {
                _id: "6612nurse124",
                name: "Emily Nurse",
                role: "nurse"
              },
              flagComment: "Pain management review needed.",
              status: "escalated",
              escalationComment: "Referred to physiotherapist for assessment.",
              createdAt: new Date(Date.now() - 172800000).toISOString()
            }
          ])
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching flagged notes:', error)
        toast.error('Failed to load flagged notes')
        setLoading(false)
      }
    }

    fetchFlaggedNotes()
  }, [])

  const handleViewNote = (note) => {
    setSelectedNote(note)
    setEscalationComment('')
    setShowModal(true)
  }

  const handleMarkReviewed = async (noteId) => {
    try {
      // await axiosInstance.put(`/coordinator/flagged-notes/${noteId}/review`)
      setFlaggedNotes(notes =>
        notes.map(note =>
          note._id === noteId
            ? { ...note, status: 'reviewed' }
            : note
        )
      )
      toast.success('Note marked as reviewed')
      setShowModal(false)
    } catch (error) {
      toast.error('Failed to update note status')
    }
  }

  const handleEscalate = async (noteId) => {
    if (!escalationComment.trim()) {
      toast.error('Please add an escalation comment')
      return
    }

    try {
      // await axiosInstance.put(`/coordinator/flagged-notes/${noteId}/escalate`, {
      //   escalationComment
      // })
      setFlaggedNotes(notes =>
        notes.map(note =>
          note._id === noteId
            ? { ...note, status: 'escalated', escalationComment }
            : note
        )
      )
      toast.success('Note escalated to admin')
      setShowModal(false)
    } catch (error) {
      toast.error('Failed to escalate note')
    }
  }

  const filteredNotes = flaggedNotes.filter(note => {
    const matchesSearch = 
      note.resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.noteText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.flaggedBy.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || note.status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Flagged Shift Notes</h1>
        <p className="mt-1 text-sm text-gray-600">
          Review and manage flagged notes from staff
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="form-input pl-10"
              placeholder="Search by resident, staff, or note content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="form-input pl-10"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Flagged Notes List */}
      <div className="space-y-4">
        {filteredNotes.map(note => (
          <div
            key={note._id}
            className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {note.resident.name}
                    </h3>
                    <StatusBadge status={note.status} />
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    Flagged by: {note.flaggedBy.name} ({note.flaggedBy.role})
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(note.shiftDate).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-gray-600">{note.noteText}</p>
                <div className="mt-2 bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                  <div className="flex items-center">
                    <FiFlag className="w-4 h-4 mr-2" />
                    <span className="font-medium">Flag Comment:</span>
                  </div>
                  <p className="mt-1">{note.flagComment}</p>
                </div>
              </div>

              {note.status === 'escalated' && note.escalationComment && (
                <div className="mt-3 bg-yellow-50 text-yellow-700 p-3 rounded-lg text-sm">
                  <div className="flex items-center">
                    <FiAlertCircle className="w-4 h-4 mr-2" />
                    <span className="font-medium">Escalation Comment:</span>
                  </div>
                  <p className="mt-1">{note.escalationComment}</p>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleViewNote(note)}
                  className="btn btn-outline text-sm"
                >
                  {note.status === 'pending' ? 'Review Note' : 'View Details'}
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-card">
            <FiFlag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No flagged notes found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No flagged notes match your current filters.
            </p>
          </div>
        )}
      </div>

      {/* View/Action Modal */}
      {showModal && selectedNote && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Flagged Note Details
                      </h3>
                      <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Resident</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedNote.resident.name}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Flagged By</h4>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedNote.flaggedBy.name} ({selectedNote.flaggedBy.role})
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Shift Date</h4>
                          <p className="mt-1 text-sm text-gray-900">
                            {new Date(selectedNote.shiftDate).toLocaleDateString()}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Note Content</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedNote.noteText}</p>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-red-800">Flag Comment</h4>
                          <p className="mt-1 text-sm text-red-700">{selectedNote.flagComment}</p>
                        </div>

                        {selectedNote.status === 'pending' && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">Escalation Comment</h4>
                            <textarea
                              rows={3}
                              className="mt-1 form-input"
                              value={escalationComment}
                              onChange={(e) => setEscalationComment(e.target.value)}
                              placeholder="Add a comment if escalating to admin..."
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedNote.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleEscalate(selectedNote._id)}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      <FiAlertCircle className="w-4 h-4 mr-2" />
                      Escalate to Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkReviewed(selectedNote._id)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      <FiCheck className="w-4 h-4 mr-2" />
                      Mark as Reviewed
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FlagShiftNotes