import React, { useState, useEffect } from 'react';
import { FiSearch, FiClock, FiCalendar, FiSend, FiCheckCircle, FiEdit2 } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const VisitRequests = () => {
  const [loading, setLoading] = useState(true);
  const [visitRequests, setVisitRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newVisitDate, setNewVisitDate] = useState('');
  const [newVisitTime, setNewVisitTime] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        setTimeout(() => {
          setVisitRequests([
            { id: 1, date: '2024-05-10', time: '3:00 PM', reason: 'Birthday celebration', status: 'approved', createdAt: '2024-04-28' },
            { id: 2, date: '2024-05-15', time: '11:00 AM', reason: 'Monthly visit', status: 'pending', createdAt: '2024-04-29' }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching visit requests:', error);
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

  const handleNewVisitSubmit = async (e) => {
    e.preventDefault();
    if (!newVisitDate || !newVisitTime || !reason.trim()) {
      toast.error('Please fill in all fields (date, time, and reason).');
      return;
    }

    try {
      setSubmitting(true);
      setTimeout(() => {
        const newRequest = {
          id: Date.now(),
          date: newVisitDate,
          time: newVisitTime,
          reason,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        setVisitRequests(prev => [...prev, newRequest]);
        setNewVisitDate('');
        setNewVisitTime('');
        setReason('');
        toast.success('Visit request submitted!');
      }, 500);
    } catch (error) {
      console.error('Error submitting visit request:', error);
      toast.error('Failed to submit visit request.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredVisits = visitRequests.filter(visit =>
    visit.date.includes(searchTerm)
  );

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Visit Requests</h1>
        <p className="text-gray-600">Request to visit your loved one and view your past requests</p>
      </div>

      {/* New Visit Request Form */}
      <div className="bg-white p-6 rounded-lg shadow-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiSend className="text-primary-600" /> Request a New Visit
        </h2>

        <form onSubmit={handleNewVisitSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date</label>
            <input
              type="date"
              className="form-input rounded-lg w-full"
              value={newVisitDate}
              onChange={(e) => setNewVisitDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
            <input
              type="time"
              className="form-input rounded-lg w-full"
              value={newVisitTime}
              onChange={(e) => setNewVisitTime(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
            <textarea
              className="form-textarea rounded-lg w-full"
              placeholder="Write a short reason..."
              rows="2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary flex items-center gap-2"
            >
              {submitting ? 'Submitting...' : <>
                <FiSend className="h-4 w-4" />
                Submit Request
              </>}
            </button>
          </div>
        </form>
      </div>

      {/* Search Field */}
      <div className="bg-white p-4 rounded-lg shadow-card">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input pl-10 w-full rounded-lg"
            placeholder="Search by date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Visit Requests List */}
      <div className="space-y-4">
        {filteredVisits.map(visit => (
          <div
            key={visit.id}
            className="bg-white p-4 rounded-lg shadow-card flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-lg transition"
          >
            <div className="flex items-start gap-4">
              <FiCalendar className="h-6 w-6 text-primary-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {new Date(visit.date).toLocaleDateString()} at {visit.time}
                </h3>
                <p className="text-gray-500 text-sm">{visit.reason}</p>
                <p className="text-xs text-gray-400 mt-1">Requested on {new Date(visit.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              {visit.status === 'approved' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                  <FiCheckCircle className="h-4 w-4 mr-1" /> Approved
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                  <FiClock className="h-4 w-4 mr-1" /> Pending
                </span>
              )}
            </div>
          </div>
        ))}

        {filteredVisits.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-card">
            <FiCalendar className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No visit requests found</h3>
            <p className="mt-2 text-base text-gray-600">
              Try submitting a new visit request above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitRequests;
