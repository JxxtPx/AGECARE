import React, { useState } from 'react';
import { FiEdit3, FiMessageSquare, FiSmile } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const SubmitFeedback = () => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({
    title: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.title || !feedback.message) {
      toast.error('Please fill in both fields.');
      return;
    }

    try {
      setLoading(true);
      // Mock submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Feedback submitted successfully!');
      setFeedback({ title: '', message: '' });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex items-center space-x-4">
        <div className="bg-primary-100 text-primary-600 p-3 rounded-full">
          <FiSmile className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Submit Feedback</h1>
          <p className="text-gray-600 text-sm">
            Tell us about your experience or any suggestions ✨
          </p>
        </div>
      </div>

      {/* Feedback Form Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Feedback Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Feedback Title
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiEdit3 className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="title"
                value={feedback.title}
                onChange={handleChange}
                className="form-input pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="E.g. Excellent service, suggestions..."
                required
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Give a short heading to your feedback</p>
          </div>

          {/* Feedback Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Message
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <FiMessageSquare className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="message"
                value={feedback.message}
                onChange={handleChange}
                rows={5}
                className="form-input pl-10 pt-3 w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 resize-none"
                placeholder="Share your detailed feedback..."
                required
              ></textarea>
            </div>
            <p className="text-xs text-gray-400 mt-1">You can write as much detail as you want.</p>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {loading ? <LoadingSpinner size="sm" color="white" /> : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitFeedback;
