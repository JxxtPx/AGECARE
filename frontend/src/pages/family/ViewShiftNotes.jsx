import React, { useState, useEffect } from 'react';
import { FiSearch, FiCalendar, FiFileText, FiClock } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ViewShiftNotes = () => {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [expandedNoteId, setExpandedNoteId] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setTimeout(() => {
          setNotes([
            {
              id: 1,
              date: '2024-05-01',
              shiftType: 'Morning',
              content: 'Resident was very active today and participated in group activities. No incidents reported.',
              staffName: 'Sarah Johnson'
            },
            {
              id: 2,
              date: '2024-05-02',
              shiftType: 'Afternoon',
              content: 'Resident complained about mild knee pain. Pain relief medication administered as prescribed.',
              staffName: 'Michael Chen'
            },
            {
              id: 3,
              date: '2024-05-03',
              shiftType: 'Night',
              content: 'Resident slept well through the night. No assistance required.',
              staffName: 'Emily Davis'
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      const noteDate = new Date(note.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDate = noteDate >= startDate && noteDate <= endDate;
    }
    return matchesSearch && matchesDate;
  });

  const toggleExpand = (id) => {
    if (expandedNoteId === id) {
      setExpandedNoteId(null);
    } else {
      setExpandedNoteId(id);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shift Notes</h1>
        <p className="text-gray-600">Review notes recorded by staff about your loved one</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Notes
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="form-input pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Search by content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Start Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
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
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
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

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.map(note => (
          <div 
            key={note.id} 
            className="bg-white p-4 rounded-lg shadow-card cursor-pointer transition hover:shadow-lg"
            onClick={() => toggleExpand(note.id)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <FiFileText className="h-6 w-6 text-primary-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{note.shiftType} Shift</h3>
                  <p className="text-gray-500 text-sm">{new Date(note.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                <FiClock className="inline-block mr-1" />
                {note.staffName}
              </div>
            </div>

            {expandedNoteId === note.id && (
              <div className="mt-4 border-t pt-4 text-gray-700 text-sm">
                {note.content}
              </div>
            )}
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-card">
            <FiFileText className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No shift notes found</h3>
            <p className="mt-2 text-base text-gray-600">
              Try adjusting your search or date range.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewShiftNotes;
