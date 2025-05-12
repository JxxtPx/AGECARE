import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Line, Pie } from 'react-chartjs-2';
import moment from 'moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import {
  FiUsers, FiActivity, FiCalendar, FiFlag, FiAlertCircle,
  FiClock, FiMessageSquare
} from 'react-icons/fi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axiosInstance.get('/admin/analytics');
        setStats(res.data);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading || !stats) return <LoadingSpinner fullScreen />;

  const renderActivityIcon = (type) => {
    switch (type) {
      case 'shift': return <span className="bg-blue-100 p-2 rounded-full text-blue-600"><FiCalendar /></span>;
      case 'feedback': return <span className="bg-purple-100 p-2 rounded-full text-purple-600"><FiMessageSquare /></span>;
      case 'incident': return <span className="bg-red-100 p-2 rounded-full text-red-600"><FiAlertCircle /></span>;
      case 'visit': return <span className="bg-green-100 p-2 rounded-full text-green-600"><FiClock /></span>;
      case 'resident': return <span className="bg-yellow-100 p-2 rounded-full text-yellow-600"><FiUsers /></span>;
      default: return <span className="bg-gray-100 p-2 rounded-full text-gray-600"><FiActivity /></span>;
    }
  };

  const chartData = {
    monthlyUsers: {
      labels: stats.monthlyUserCounts.map((m) => m.month),
      datasets: [{
        label: 'Active Users',
        data: stats.monthlyUserCounts.map((m) => m.count),
        fill: false,
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.4
      }]
    },
    staffDistribution: {
      labels: ['Nurses', 'Carers'],
      datasets: [{
        data: [stats.totalNurses, stats.totalCarers],
        backgroundColor: ['rgb(59, 130, 246)', 'rgb(16, 185, 129)']
      }]
    }
  };
  

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of facility operations and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="card"><span className="text-blue-600 mb-2"><FiUsers size={20} /></span><span className="text-sm text-gray-500">Total Residents</span><span className="text-2xl font-bold">{stats.totalResidents}</span></div>
        <div className="card"><span className="text-green-600 mb-2"><FiClock size={20} /></span><span className="text-sm text-gray-500">Approved Visits</span><span className="text-2xl font-bold">{stats.upcomingVisits}</span></div>
        <div className="card"><span className="text-yellow-600 mb-2"><FiMessageSquare size={20} /></span><span className="text-sm text-gray-500">New in 7 Days</span><span className="text-2xl font-bold">{stats.newResidentsLast7Days}</span></div>
        <div className="card"><span className="text-red-600 mb-2"><FiAlertCircle size={20} /></span><span className="text-sm text-gray-500">Open Incidents</span><span className="text-2xl font-bold">{stats.openIncidents}</span></div>
        <div className="card"><span className="text-indigo-600 mb-2"><FiAlertCircle size={20} /></span><span className="text-sm text-gray-500">Closed Incidents</span><span className="text-2xl font-bold">{stats.closedIncidents}</span></div>
        <div className="card"><span className="text-indigo-600 mb-2"><FiCalendar size={20} /></span><span className="text-sm text-gray-500">This Month</span><span className="text-2xl font-bold">{stats.incidentsThisMonth}</span></div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Monthly Active Users</h2>
          <div className="h-64">
            <Line data={chartData.monthlyUsers} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Staff Distribution</h2>
          <div className="h-64">
            <Pie data={chartData.staffDistribution} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="flow-root">
          <ul className="-mb-8">
            {stats.recentActivity?.map((activity, idx) => (
              <li key={idx}>
                <div className="relative pb-8">
                  {idx !== stats.recentActivity.length - 1 && (
                    <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"></span>
                  )}
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">{renderActivityIcon(activity.type)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                      <p className="mt-0.5 text-sm text-gray-500">{activity.user}</p>
                      <div className="mt-1 text-xs text-gray-500">{moment(activity.time).fromNow()}</div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
