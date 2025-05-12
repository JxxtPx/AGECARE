import React, { useState, useEffect } from 'react';
import { FiFileText, FiClock, FiCalendar, FiUser, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ViewShiftNotes = () => {
  const [loading, setLoading] = useState(true);
  const [shiftNotes, setShiftNotes] = useState([]);
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // Mock Data
        setTimeout(() => {
          setShiftNotes([
            {
              id: 1,
              date: '2025-04-20',
              shiftType: 'Morning',
              createdBy: 'Nurse Sarah Johnson',
              noteSummary: 'Patient woke up with mild dizziness. Assisted with breakfast. BP stable. Observed fatigue during walk. Hydration encouraged. Recommended extra rest after lunch and medication was administered as prescribed.'
            },
            {
              id: 2,
              date: '2025-04-19',
              shiftType: 'Afternoon',
              createdBy: 'Carer Michael Chen',
              noteSummary: 'Patient engaged in recreational activities. No distress observed.'
            },
            {
              id: 3,
              date: '2025-04-18',
              shiftType: 'Night',
              createdBy: 'Nurse Emily Davis',
              noteSummary: 'Patient slept through the night. Vital signs were monitored every two hours and remained stable throughout. No incidents reported overnight. Provided hydration once during midnight.'
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch shift notes:', error);
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const toggleExpand = (id) => {
    setExpandedNoteId(prev => (prev === id ? null : id));
  };

  const filteredNotes = shiftNotes.filter(note => {
    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      const noteDate = new Date(note.date);
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      matchesDate = noteDate >= start && noteDate <= end;
    }
    return matchesDate;
  });

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Shift Notes</h1>
        <p className="mt-1 text-base text-gray-600">
          Review your care notes recorded by staff
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                className="form-input pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                className="form-input pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Shift Notes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNotes.map(note => (
          <div key={note.id} className="bg-white rounded-lg shadow-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FiFileText className="text-primary-600 w-6 h-6" />
                <div>
                  <p className="font-semibold text-gray-800">{note.shiftType} Shift</p>
                  <p className="text-sm text-gray-500">{note.date}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 space-x-1">
                <FiUser className="w-4 h-4" />
                <span>{note.createdBy}</span>
              </div>
            </div>

            <div className="text-gray-700 text-sm">
              {expandedNoteId === note.id ? (
                <>
                  {note.noteSummary}
                  <button
                    onClick={() => toggleExpand(note.id)}
                    className="text-primary-600 text-xs mt-2 flex items-center space-x-1"
                  >
                    <FiChevronUp className="w-4 h-4" />
                    <span>Show Less</span>
                  </button>
                </>
              ) : (
                <>
                  {note.noteSummary.length > 100
                    ? `${note.noteSummary.slice(0, 100)}...`
                    : note.noteSummary
                  }
                  {note.noteSummary.length > 100 && (
                    <button
                      onClick={() => toggleExpand(note.id)}
                      className="text-primary-600 text-xs mt-2 flex items-center space-x-1"
                    >
                      <FiChevronDown className="w-4 h-4" />
                      <span>Show More</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <div className="text-center col-span-2 py-12 bg-white rounded-xl shadow-lg">
            <FiClock className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No shift notes found</h3>
            <p className="mt-2 text-base text-gray-600">
              No care notes available for your account.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewShiftNotes;
