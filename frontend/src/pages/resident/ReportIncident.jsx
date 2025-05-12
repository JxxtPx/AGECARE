import React, { useState } from 'react';
import { FiAlertCircle, FiFileText, FiCalendar, FiClock } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const ReportIncident = () => {
  const [loading, setLoading] = useState(false);
  const [incident, setIncident] = useState({
    type: '',
    description: '',
    date: '',
    time: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIncident(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!incident.type || !incident.description || !incident.date || !incident.time) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      // Mock submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Incident reported successfully!');
      setIncident({ type: '', description: '', date: '', time: '' });
    } catch (error) {
      console.error('Error reporting incident:', error);
      toast.error('Failed to report incident.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="bg-red-100 text-red-600 p-3 rounded-full">
          <FiAlertCircle className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report an Incident</h1>
          <p className="text-gray-600 text-sm">
            Please provide details about the incident you witnessed or experienced.
          </p>
        </div>
      </div>

      {/* Incident Form Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Incident Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Incident Type
            </label>
            <select
              name="type"
              value={incident.type}
              onChange={handleChange}
              className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            >
              <option value="">Select Type</option>
              <option value="Fall">Fall</option>
              <option value="Aggression">Aggression</option>
              <option value="Medication Error">Medication Error</option>
              <option value="Other">Other</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">Select the category that best matches the incident.</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <FiFileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="description"
                value={incident.description}
                onChange={handleChange}
                rows={5}
                className="form-input pl-10 pt-3 w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 resize-none"
                placeholder="Describe what happened in detail..."
                required
              ></textarea>
            </div>
            <p className="text-xs text-gray-400 mt-1">Please be as detailed as possible.</p>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Incident
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="date"
                  value={incident.date}
                  onChange={handleChange}
                  className="form-input pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time of Incident
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiClock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="time"
                  name="time"
                  value={incident.time}
                  onChange={handleChange}
                  className="form-input pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {loading ? <LoadingSpinner size="sm" color="white" /> : 'Report Incident'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ReportIncident;
