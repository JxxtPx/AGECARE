import React, { useState, useEffect } from 'react'
import { FiSearch, FiCalendar, FiEdit3, FiEye } from 'react-icons/fi'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import axiosInstance from '../../api/axiosInstance'
import { toast } from 'react-toastify'
import { formatDate } from '../../utils/formatDate'

const ShiftNotes = () => {
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNote, setSelectedNote] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [noteContent, setNoteContent] = useState('')

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // const response = await axiosInstance.get('/nurse/shift-notes')
        // setNotes(response.data)

        // Mock data
        setNotes([
          {
            id: 1,
            shiftId: 1,
            residentName: 'John Smith',
            residentRoom: '101',
            date: new Date(),
            content: 'Patient had a good day. Vital signs stable. Medication administered on schedule.',
            status: 'completed'
          },
          {
            id: 2,
            shiftId: 2,
            residentName: 'Mary Johnson',
            residentRoom: '102',
            date: new Date(Date.now() - 86400000),
            content: 'Resident participated in group activities. Appetite improved.',
            status: 'completed'
          }
        ])
        setLoading(false)
      } catch (error) {
        console.error('Error fetching notes:', error)
        toast.error('Failed to load shift notes')
        setLoading(false)
      }
    }

    fetchNotes()
  }, [])

  const handleCreateNote = () => {
    setSelectedNote(null)
    setNoteContent('')
    setIsEditing(true)
  }

  const handleEditNote = (note) => {
    setSelectedNote(note)
    setNoteContent(note.content)
    setIsEditing(true)
  }

  const handleViewNote = (note) => {
    setSelectedNote(note)
    setNoteContent(note.content)
    setIsEditing(false)
  }

  const handleSaveNote = async () => {
    try {
      if (!noteContent.trim()) {
        toast.error('Note content cannot be empty')
        return
      }

      // if (selectedNote) {
      //   await axiosInstance.put(`/nurse/shift-notes/${selectedNote.id}`, {
      //     content: noteContent
      //   })
      // } else {
      //   await axiosInstance.post('/nurse/shift-notes', {
      //     content: noteContent
      //   })
      // }

      toast.success(selectedNote ? 'Note updated successfully' : 'Note created successfully')
      setIsEditing(false)
      setSelectedNote(null)
      setNoteContent('')
      // Refresh notes list
    } catch (error) {
      toast.error('Failed to save note')
    }
  }

  const filteredNotes = notes.filter(note =>
    note.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shift Notes</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage and view shift notes for your residents
        </p>
      </div>

      {/* Actions */}
      <div className="bg-white p-4 rounded-lg shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="flex justify-end">
            <button
              onClick={handleCreateNote}
              className="btn btn-primary"
            >
              Create New Note
            </button>
          </div>
        </div>
      </div>

      {/* Notes List and Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes List */}
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Notes</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleViewNote(note)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {note.residentName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Room {note.residentRoom}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditNote(note)
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <FiEdit3 size={16} />
                    </button>
                    <span className="text-xs text-gray-500">
                      {formatDate(note.date, { relative: true })}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {note.content}
                </p>
              </div>
            ))}
            {filteredNotes.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No notes found
              </div>
            )}
          </div>
        </div>

        {/* Note Editor/Viewer */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? (selectedNote ? 'Edit Note' : 'New Note') : 'View Note'}
            </h2>
            {selectedNote && !isEditing && (
              <button
                onClick={() => handleEditNote(selectedNote)}
                className="btn btn-outline"
              >
                Edit
              </button>
            )}
          </div>

          {(isEditing || selectedNote) ? (
            <div className="space-y-4">
              {isEditing ? (
                <textarea
                  className="form-input min-h-[200px]"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Enter note content..."
                />
              ) : (
                <div className="prose max-w-none">
                  <p>{selectedNote?.content}</p>
                </div>
              )}

              {isEditing && (
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setSelectedNote(null)
                    }}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNote}
                    className="btn btn-primary"
                  >
                    Save Note
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiEdit3 className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">Select a note to view or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShiftNotes