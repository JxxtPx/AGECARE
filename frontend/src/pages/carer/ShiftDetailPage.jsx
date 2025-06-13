import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiClock, FiFileText, FiCheckSquare, FiUsers, FiFile, FiArrowLeft, FiChevronDown, FiChevronUp, FiChevronRight } from 'react-icons/fi'

import { AuthContext } from '../../context/AuthContext'
import axiosInstance from '../../api/axiosInstance'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import StatusBadge from '../../components/common/StatusBadge'
import BottomNav from '../../components/layout/BottomNav'
import { toast } from 'react-toastify'

const ShiftDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')
  const [shift, setShift] = useState(null)
  const [showAllergies, setShowAllergies] = useState(false);
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [selectedNoteCategory, setSelectedNoteCategory] = useState('general')
  const [noteCategories, setNoteCategories] = useState([]);
  const [careTasks, setCareTasks] = useState([])
  const [contacts, setContacts] = useState([])
  const [documents, setDocuments] = useState([])
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [expandedNote, setExpandedNote] = useState(null)
  const [isFlagged, setIsFlagged] = useState(false);
  const [flagComment, setFlagComment] = useState('');
  const [careForms, setCareForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);



  const handleToggleCategory = (categoryId) => {
    setExpandedCategory(prev => (prev === categoryId ? null : categoryId))
    setExpandedNote(null)
  }

  const handleToggleNote = (noteId) => {
    setExpandedNote(prev => (prev === noteId ? null : noteId))
  }

  useEffect(() => {
    const fetchShiftData = async () => {
      try {
        setLoading(true);
        setNoteCategories([]); // Reset before loading new data

        const { data } = await axiosInstance.get(`/carer/shifts/${id}`);
        setShift(data);
        setContacts(data.resident?.emergencyContacts || []);

        // Fetch resident documents
        const fileRes = await axiosInstance.get(`/shared/files/${data.resident._id}`);
        setDocuments(fileRes.data);

        const formRes = await axiosInstance.get(`/shared/careforms/resident/${data.resident._id}`);
        setCareForms(formRes.data);

        // ✅ Fetch categories specifically for this resident
        const categoriesRes = await axiosInstance.get(`/shared/notecategories/resident/${data.resident._id}`);

        setNoteCategories(categoriesRes.data);

        // ✅ Fetch notes for this resident
        const notesRes = await axiosInstance.get(`/carer/shiftnotes/resident/${data.resident._id}`);
        setNotes(notesRes.data);

        setCareTasks([]); // placeholder
        setLoading(false);
      } catch (error) {
        console.error("🚨 Error fetching shift data:", error?.response?.data || error.message);
        toast.error("Failed to load shift details");
        setLoading(false);
      }
    };

    fetchShiftData();
  }, [id]);


  const handleStartShift = async () => {
    try {
      await axiosInstance.put(`/carer/shifts/${id}/start`);
      const updated = await axiosInstance.get(`/carer/shifts/${id}`);
      setShift(updated.data);
      toast.success('Shift started successfully');
    } catch (error) {
      console.error('Error starting shift:', error);
      toast.error('Failed to start shift');
    }
  };

  const handleCompleteShift = async () => {
    try {
      await axiosInstance.put(`/carer/shifts/${id}/complete`);
      const updated = await axiosInstance.get(`/carer/shifts/${id}`);
      setShift(updated.data);
      toast.success('Shift completed successfully');
    } catch (error) {
      console.error('Error completing shift:', error);
      toast.error('Failed to complete shift');
    }
  };

  const handleSubmitNote = async (e, categoryName) => {
    e.preventDefault();
    if (!newNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    try {
      const { data } = await axiosInstance.post(`/carer/shiftnotes/resident/${shift.resident._id}`, {
        note: newNote,
        category: categoryName,
        shift: shift._id,
        resident: shift.resident._id,
        isFlagged,
        flagComment: isFlagged ? flagComment : undefined
      });

      setNotes(prev => [data, ...prev]);
      setNewNote('');
      setIsFlagged(false);
      setFlagComment('');
      toast.success('Note added successfully');
    } catch (error) {
      console.error('Error adding note:', error?.response?.data || error.message);
      toast.error('Failed to add note');
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const { data } = await axiosInstance.put(`/carer/tasks/${id}/${taskId}/toggle`);
      setCareTasks(prev =>
        prev.map(task => task._id === taskId ? data : task)
      );
      toast.success("Task updated");
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return ''
    const date = new Date(timeString)
    return date instanceof Date && !isNaN(date)
      ? date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      : timeString
  }

  if (loading) return <LoadingSpinner fullScreen />

  if (!shift) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Shift not found</h2>
        <button
          onClick={() => navigate('/carer/shifts')}
          className="mt-4 text-primary-600 hover:text-primary-700"
        >
          Return to Shifts
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/carer/shifts')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
          >
            <FiArrowLeft className="w-4 h-4 mr-1" />
            Back to Shifts
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Shift Details
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {shift.resident.fullName} - Room {shift.resident.roomNumber}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {shift.status === 'scheduled' && (
            <button
              onClick={handleStartShift}
              className="btn btn-primary"
            >
              <FiClock className="w-4 h-4 mr-2" />
              Start Shift
            </button>
          )}
          {shift.status === 'in-progress' && (
            <button
              onClick={handleCompleteShift}
              className="btn btn-success"
            >
              <FiCheckSquare className="w-4 h-4 mr-2" />
              Complete Shift
            </button>
          )}
        </div>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:block bg-white rounded-lg shadow-card">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'details'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <FiClock className="w-4 h-4 mr-2 inline-block" />
              Details
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'notes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <FiFileText className="w-4 h-4 mr-2 inline-block" />
              Notes
            </button>
            <button
              onClick={() => setActiveTab('care')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'care'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <FiCheckSquare className="w-4 h-4 mr-2 inline-block" />
              Care Tasks
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'contacts'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <FiUsers className="w-4 h-4 mr-2 inline-block" />
              Contacts
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'docs'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <FiFile className="w-4 h-4 mr-2 inline-block" />
              Documents
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Tab Content */}
          {activeTab === 'details' && (
            <div className="bg-white rounded-lg shadow-card p-4 space-y-6">

              {/* Header Info */}
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-gray-900">{shift.resident.fullName}</h2>
                <p className="text-sm text-gray-600">{shift.type} – {shift.startTime} to {shift.endTime}</p>
                <p className="text-sm text-gray-600">{new Date(shift.date).toLocaleDateString()}</p>
              </div>

              {/* Alerts / Key Notes */}
              <div className="space-y-2">
                <div className="bg-red-100 text-red-800 p-3 rounded-md text-sm font-medium">
                  🚨 Key Box number {shift.resident?.keyBoxCode ?? 'N/A'} for emergency access
                </div>
                {shift.resident?.allergies && shift.resident.allergies.length > 0 && (
                  <div className="bg-red-100 text-red-800 p-3 rounded-md text-sm font-medium">
                    <button
                      onClick={() => setShowAllergies(!showAllergies)}
                      className="flex items-center justify-between w-full"
                    >
                      ⚠️ This client has known allergies
                      {showAllergies ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
                    </button>
                    {showAllergies && (
                      <ul className="mt-2 list-disc list-inside text-sm text-red-700">
                        {shift.resident.allergies.map((allergy, index) => (
                          <li key={index}>{allergy}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                {notes.length > 0 && (
                  <button
                    onClick={() => setActiveTab('notes')}
                    className="w-full text-left bg-yellow-100 text-yellow-800 p-3 rounded-md text-sm font-medium hover:bg-yellow-200 transition"
                  >
                    📝 This visit has notes – click to view
                  </button>
                )}

              </div>

              {/* Service Info */}
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-gray-800">Service</h3>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-1">
                  <p><span className="font-medium">Type:</span> {shift.type}</p>
                  <p><span className="font-medium">Location:</span> {shift.resident?.address ?? 'N/A'}</p>
                  <p><span className="font-medium">Time:</span> {shift.startTime} – {shift.endTime}</p>
                </div>
              </div>

              {/* Actual Timing */}
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-gray-800">Timing Info</h3>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-1">
                  <p><span className="font-medium">Actual Start:</span> {formatTime(shift.actualStartTime)}</p>
                  <p><span className="font-medium">Actual End:</span> {formatTime(shift.actualEndTime)}</p>
                  <p><span className="font-medium">Status:</span> {shift.status}</p>
                </div>
              </div>

              {/* Resident Info */}
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-gray-800">Client Info</h3>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-1">
                  <p><span className="font-medium">DOB:</span> {shift.resident?.dateOfBirth ? new Date(shift.resident.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                  <p><span className="font-medium">Gender:</span> {shift.resident?.gender ?? 'N/A'}</p>
                  <p><span className="font-medium">Phone:</span> {shift.resident?.contactInfo?.phone ?? 'N/A'}</p>
                  <p><span className="font-medium">Address:</span> {shift.resident?.contactInfo?.address ?? 'N/A'}</p>

                </div>
              </div>

              {/* Admin Metadata (optional) */}
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-gray-800">Schedule Info</h3>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-1">
                  <p><span className="font-medium">Care Workers:</span> {shift.careWorkers ?? 1}</p>
                  <p><span className="font-medium">Schedule ID:</span> {shift.scheduleId ?? '—'}</p>
                  <p><span className="font-medium">Team:</span> {shift.clientTeam ?? 'Community Nursing'}</p>
                </div>
              </div>

            </div>
          )}


          {activeTab === 'notes' && (
            <div className="space-y-6">
              {/* Notes List */}
              <div className="grid gap-4">
                {noteCategories.map(category => {
                  const categoryNotes = notes.filter(note => note.category === category.name);

                  return (
                    <div key={category._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      {/* Category Header */}
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border-b">
                        <button
                          onClick={() => setExpandedCategory(expandedCategory === category._id ? null : category._id)}
                          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 group"
                        >
                          <span className="font-semibold text-lg">{category.name}</span>
                          <span className="text-sm text-gray-500">({categoryNotes.length})</span>
                          {expandedCategory === category._id ? (
                            <FiChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                          ) : (
                            <FiChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                          )}
                        </button>
                        <button
                          onClick={() => setExpandedCategory(category._id)}
                          className="btn btn-primary btn-sm flex items-center space-x-2"
                        >
                          <FiFileText className="w-4 h-4" />
                          <span>Add Note</span>
                        </button>
                      </div>

                      {/* Content */}
                      {expandedCategory === category._id && (
                        <div className="divide-y divide-gray-100">
                          {/* Add Note Form */}
                          <div className="p-4 bg-gray-50">
                            <form onSubmit={(e) => handleSubmitNote(e, category.name)} className="space-y-4">
                              <div>
                                <label htmlFor={`note-${category._id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                  Add Note
                                </label>
                                <textarea
                                  id={`note-${category._id}`}
                                  rows={10}
                                  className="form-input w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                                  value={newNote}
                                  onChange={(e) => setNewNote(e.target.value)}
                                  placeholder="Enter your note here..."
                                />
                              </div>

                              {/* Blue Toggle for Flag */}
                              <div className="flex items-center space-x-3">
                                <button
                                  type="button"
                                  onClick={() => setIsFlagged(!isFlagged)}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${isFlagged ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isFlagged ? 'translate-x-6' : 'translate-x-1'
                                      }`}
                                  />
                                </button>
                                <span className="text-sm text-gray-700 font-medium">Flag this note</span>
                              </div>

                              {isFlagged && (
                                <div>
                                  <label htmlFor="flagComment" className="block text-sm font-medium text-red-700 mb-1">
                                    Flag Comment
                                  </label>
                                  <textarea
                                    id="flagComment"
                                    rows={2}
                                    className="form-input w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500 placeholder:text-sm"
                                    value={flagComment}
                                    onChange={(e) => setFlagComment(e.target.value)}
                                    placeholder=" Explain why this note is flagged..."
                                  />
                                </div>
                              )}

                              <button type="submit" className="btn btn-primary w-full flex items-center justify-center space-x-2">
                                <FiFileText className="w-4 h-4" />
                                <span>Add Note</span>
                              </button>
                            </form>

                          </div>

                          {/* Existing Notes */}
                          {categoryNotes.length > 0 ? (
                            categoryNotes.map(note => (
                              <div key={note._id} className="p-4 hover:bg-gray-50 transition-colors">
                                <button
                                  onClick={() => setExpandedNote(expandedNote === note._id ? null : note._id)}
                                  className="w-full text-left group"
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center space-x-2">
                                          <span className="text-sm font-medium text-gray-900">
                                            {note.user.name}
                                          </span>
                                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                            {note.user.role}
                                          </span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                          {new Date(note.createdAt).toLocaleString()}
                                        </p>
                                      </div>
                                      <p className={`text-sm text-gray-700 ${expandedNote !== note._id ? 'line-clamp-2' : ''}`}>
                                        {note.note}
                                      </p>
                                    </div>
                                    {expandedNote === note._id ? (
                                      <FiChevronUp className="w-5 h-5 ml-2 flex-shrink-0 text-gray-400 group-hover:text-gray-600" />
                                    ) : (
                                      <FiChevronDown className="w-5 h-5 ml-2 flex-shrink-0 text-gray-400 group-hover:text-gray-600" />
                                    )}
                                  </div>
                                </button>

                                {note.isFlagged && (
                                  <div className="mt-2 bg-red-50 text-red-800 text-sm p-2 rounded-md border border-red-100">
                                    <span className="font-semibold">⚠️ Flagged:</span> {note.flagComment}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="p-8 text-center">
                              <div className="text-gray-400 mb-2">
                                <FiFileText className="w-8 h-8 mx-auto" />
                              </div>
                              <p className="text-gray-500 text-sm">
                                No notes in this category yet
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}


          {activeTab === 'care' && (
            <div className="space-y-4">
              {careTasks.map(task => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task._id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className={`ml-3 text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                      {task.task}
                    </span>
                  </div>
                  <StatusBadge status={task.completed ? 'completed' : 'pending'} />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-6">
              {contacts.length > 0 ? contacts.map((c, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900">{c.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{c.relation}</p>
                  <p className="mt-1 text-sm text-gray-600">{c.phone}</p>
                  {c.email && <p className="mt-1 text-sm text-gray-600">{c.email}</p>}
                  {c.address && <p className="mt-1 text-sm text-gray-600">{c.address}</p>}
                </div>
              )) : (
                <p className="text-center text-gray-500">No emergency contacts available</p>
              )}
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-4">
              {/* === Documents === */}
              {documents.map((doc, index) => (
                <a
                  key={`doc-${index}`}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <FiFile className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {doc.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {doc.createdAt
                          ? new Date(doc.createdAt).toLocaleDateString('en-AU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                          : 'N/A'}
                      </p>
                      {doc.notes && (
                        <p className="text-xs text-gray-600 mt-1 truncate">{doc.notes}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <FiChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </a>
              ))}

              {/* === Care Forms === */}
              {careForms.map((form, index) => (
                <div
                  key={`form-${index}`}
                  onClick={() => setSelectedForm(form)}
                  className="block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <FiFileText className="w-8 h-8 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{form.title}</p>
                      <p className="text-xs text-gray-500 truncate">{form.description || 'No description'}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <FiChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

              ))}
              {selectedForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white w-full max-w-3xl p-6 rounded shadow-lg overflow-y-auto max-h-[90vh] relative">
                    <button
                      onClick={() => setSelectedForm(null)}
                      className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
                    >
                      ✕
                    </button>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">{selectedForm.title}</h2>
                    <p className="text-sm text-gray-600 mb-4">{selectedForm.description}</p>

                    <div className="space-y-4">
                      {selectedForm.questions?.map((q, index) => (
                        <div key={index} className="bg-gray-50 border rounded-md p-4">
                          <p className="font-medium text-gray-800">
                            {index + 1}. {q.questionText}
                            {q.isRequired && <span className="text-red-500 ml-1">*</span>}
                          </p>

                          <div className="mt-2 text-sm text-gray-700">
                            {q.type === 'text' || q.type === 'textarea' ? (
                              <p className="italic text-gray-400">[Text response]</p>
                            ) : (
                              <ul className="list-disc ml-5">
                                {q.options?.map((opt, i) => (
                                  <li key={i}>{opt}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}


        </div>
      </div>

      {/* Mobile Content */}
      <div className="md:hidden">
        {activeTab === 'details' && (
          <div className="bg-white rounded-lg shadow-card p-4 space-y-6">

            {/* Header Info */}
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-gray-900">{shift.resident.fullName}</h2>
              <p className="text-sm text-gray-600">{shift.type} – {shift.startTime} to {shift.endTime}</p>
              <p className="text-sm text-gray-600">{new Date(shift.date).toLocaleDateString()}</p>
            </div>

            {/* Alerts / Key Notes */}
            <div className="space-y-2">
              <div className="bg-red-100 text-red-800 p-3 rounded-md text-sm font-medium">
                🚨 Key Box number {shift.resident?.keyBoxCode ?? 'N/A'} for emergency access
              </div>
              {shift.resident?.allergies && shift.resident.allergies.length > 0 && (
                <div className="bg-red-100 text-red-800 p-3 rounded-md text-sm font-medium">
                  <button
                    onClick={() => setShowAllergies(!showAllergies)}
                    className="flex items-center justify-between w-full"
                  >
                    ⚠️ This client has known allergies
                    {showAllergies ? (
                      <FiChevronUp className="ml-2" />
                    ) : (
                      <FiChevronDown className="ml-2" />
                    )}
                  </button>
                  {showAllergies && (
                    <ul className="mt-2 list-disc list-inside text-sm text-red-700">
                      {shift.resident.allergies.map((allergy, idx) => (
                        <li key={idx}>{allergy}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {notes.length > 0 && (
                <button
                  onClick={() => setActiveTab('notes')}
                  className="w-full text-left bg-yellow-100 text-yellow-800 p-3 rounded-md text-sm font-medium hover:bg-yellow-200 transition"
                >
                  📝 This visit has notes – click to view
                </button>
              )}

            </div>

            {/* Service Info */}
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-gray-800">Service</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-1">
                <p><span className="font-medium">Type:</span> {shift.type}</p>
                <p><span className="font-medium">Location:</span> {shift.resident?.address ?? 'N/A'}</p>
                <p><span className="font-medium">Time:</span> {shift.startTime} – {shift.endTime}</p>
              </div>
            </div>

            {/* Actual Timing */}
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-gray-800">Timing Info</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-1">
                <p><span className="font-medium">Actual Start:</span> {formatTime(shift.actualStartTime)}</p>
                <p><span className="font-medium">Actual End:</span> {formatTime(shift.actualEndTime)}</p>
                <p><span className="font-medium">Status:</span> {shift.status}</p>
              </div>
            </div>

            {/* Resident Info */}
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-gray-800">Client Info</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-1">
                <p><span className="font-medium">DOB:</span> {shift.resident?.dateOfBirth ? new Date(shift.resident.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                <p><span className="font-medium">Gender:</span> {shift.resident?.gender ?? 'N/A'}</p>
                <p><span className="font-medium">Phone:</span> {shift.resident?.contactInfo?.phone ?? 'N/A'}</p>
                <p><span className="font-medium">Address:</span> {shift.resident?.contactInfo?.address ?? 'N/A'}</p>
              </div>
            </div>

            {/* Admin Info */}
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-gray-800">Schedule Info</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-1">
                <p><span className="font-medium">Care Workers:</span> {shift.careWorkers ?? 1}</p>
                <p><span className="font-medium">Schedule ID:</span> {shift.scheduleId ?? '—'}</p>
                <p><span className="font-medium">Team:</span> {shift.clientTeam ?? 'Community Nursing'}</p>
              </div>
            </div>
          </div>
        )}



        {activeTab === 'notes' && (
          <div className="md:hidden space-y-4">
            {noteCategories.map(category => {
              const categoryNotes = notes.filter(note => note.category === category.name); // Use category.name consistently

              return (
                <div key={category._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Category Header */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border-b">
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)} // use category.name
                      className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 group"
                    >
                      <span className="font-semibold text-lg">{category.name}</span>
                      <span className="text-sm text-gray-500">({categoryNotes.length})</span>
                      {expandedCategory === category.name ? (
                        <FiChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      ) : (
                        <FiChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      )}
                    </button>
                    <button
                      onClick={() => setExpandedCategory(category.name)} // use category.name
                      className="btn btn-primary btn-sm flex items-center space-x-2"
                    >
                      <FiFileText className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Expandable Content */}
                  {expandedCategory === category.name && ( // use category.name
                    <div className="divide-y divide-gray-100">
                      {/* Add Note Form */}
                      <div className="p-4 bg-gray-50">
                        <form onSubmit={(e) => handleSubmitNote(e, category.name)} className="space-y-4">
                          <div>
                            <label htmlFor={`note-${category._id}`} className="block text-sm font-medium text-gray-700 mb-1">
                              Add Note
                            </label>
                            <textarea
                              id={`note-${category._id}`}
                              rows={10}
                              className="form-input w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 min-h-[150px] p-3"
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                              placeholder="Enter your note here..."
                            />
                          </div>

                          {/* Blue Toggle for Flag - Mobile */}
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={() => setIsFlagged(!isFlagged)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${isFlagged ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isFlagged ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                              />
                            </button>
                            <span className="text-sm text-gray-700 font-medium">Flag this note</span>
                          </div>

                          {isFlagged && (
                            <div>
                              <label htmlFor="flagComment" className="block text-sm font-medium text-red-700 mb-1">
                                Flag Comment
                              </label>
                              <textarea
                                id="flagComment"
                                rows={2}
                                className="form-input w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500 placeholder:text-sm"
                                value={flagComment}
                                onChange={(e) => setFlagComment(e.target.value)}
                                placeholder=" Explain why this note is flagged..."
                              />
                            </div>
                          )}

                          <button type="submit" className="btn btn-primary w-full flex items-center justify-center space-x-2">
                            <FiFileText className="w-4 h-4" />
                            <span>Add Note</span>
                          </button>
                        </form>

                      </div>

                      {/* Note List */}
                      {categoryNotes.length > 0 ? (
                        categoryNotes.map(note => (
                          <div key={note._id} className="p-4 hover:bg-gray-50 transition-colors">
                            <button
                              onClick={() => setExpandedNote(expandedNote === note._id ? null : note._id)}
                              className="w-full text-left group"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-medium text-gray-900">
                                        {note.user.name}
                                      </span>
                                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                        {note.user.role}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                      {new Date(note.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                  <p className={`text-sm text-gray-700 ${expandedNote !== note._id ? 'line-clamp-2' : ''}`}>
                                    {note.note}
                                  </p>
                                </div>
                                {expandedNote === note._id ? (
                                  <FiChevronUp className="w-5 h-5 ml-2 text-gray-400 group-hover:text-gray-600" />
                                ) : (
                                  <FiChevronDown className="w-5 h-5 ml-2 text-gray-400 group-hover:text-gray-600" />
                                )}
                              </div>
                            </button>

                            {note.isFlagged && (
                              <div className="mt-2 bg-red-50 text-red-800 text-sm p-2 rounded-md border border-red-100">
                                <span className="font-semibold">⚠️ Flagged:</span> {note.flagComment}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <div className="text-gray-400 mb-2">
                            <FiFileText className="w-8 h-8 mx-auto" />
                          </div>
                          <p className="text-gray-500 text-sm">
                            No notes in this category yet
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

          </div>
        )}


        {activeTab === 'care' && (
          <div className="bg-white rounded-lg shadow-card p-4">
            <div className="space-y-4">
              {careTasks.map(task => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task._id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className={`ml-3 text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                      {task.task}
                    </span>
                  </div>
                  <StatusBadge status={task.completed ? 'completed' : 'pending'} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="bg-white rounded-lg shadow-card p-4">
            {contacts.length > 0 ? contacts.map((c, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-sm font-medium text-gray-900">{c.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{c.relation}</p>
                <p className="mt-1 text-sm text-gray-600">{c.phone}</p>
                {c.email && <p className="mt-1 text-sm text-gray-600">{c.email}</p>}
                {c.address && <p className="mt-1 text-sm text-gray-600">{c.address}</p>}
              </div>
            )) : (
              <p className="text-center text-gray-500">No emergency contacts available</p>
            )}
          </div>
        )}


        {activeTab === 'docs' && (
          <div className="md:hidden space-y-4">
            {/* === Documents === */}
            {documents.map((doc, index) => (
              <a
                key={`doc-${index}`}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FiFile className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {doc.createdAt
                        ? new Date(doc.createdAt).toLocaleDateString('en-AU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })
                        : 'N/A'}
                    </p>
                    {doc.notes && (
                      <p className="text-xs text-gray-600 mt-1 truncate">{doc.notes}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <FiChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </a>
            ))}

            {/* === Care Forms (Mobile) === */}
            {careForms.map((form, index) => (
              <div
                key={`form-${index}`}
                onClick={() => setSelectedForm(form)}
                className="block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FiFileText className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{form.title}</p>
                    <p className="text-xs text-gray-500 truncate">{form.description || 'No description'}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <FiChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}

            {/* === Mobile Form Preview Modal === */}
            {selectedForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white w-full max-w-3xl p-6 rounded shadow-lg overflow-y-auto max-h-[90vh] relative">
                  <button
                    onClick={() => setSelectedForm(null)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
                  >
                    ✕
                  </button>
                  <h2 className="text-lg font-bold text-gray-800 mb-4">{selectedForm.title}</h2>
                  <p className="text-sm text-gray-600 mb-4">{selectedForm.description}</p>

                  <div className="space-y-4">
                    {selectedForm.questions?.map((q, index) => (
                      <div key={index} className="bg-gray-50 border rounded-md p-4">
                        <p className="font-medium text-gray-800">
                          {index + 1}. {q.questionText}
                          {q.isRequired && <span className="text-red-500 ml-1">*</span>}
                        </p>

                        <div className="mt-2 text-sm text-gray-700">
                          {q.type === 'text' || q.type === 'textarea' ? (
                            <p className="italic text-gray-400">[Text response]</p>
                          ) : (
                            <ul className="list-disc ml-5">
                              {q.options?.map((opt, i) => (
                                <li key={i}>{opt}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}


      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default ShiftDetails