import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiClipboard, FiCheckSquare, FiFlag, FiMessageCircle } from 'react-icons/fi'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { Line, Pie } from 'react-chartjs-2'
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
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [flaggedNotes, setFlaggedNotes] = useState([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Mock data
        setTimeout(() => {
          setStats({
            totalCarePlans: 45,
            totalTasks: 78,
            openNotes: 12,
            newMessages: 5
          })

          setChartData({
            taskStatus: {
              labels: ['Completed', 'Pending', 'Overdue'],
              datasets: [{
                data: [65, 25, 10],
                backgroundColor: [
                  'rgb(34, 197, 94)',
                  'rgb(234, 179, 8)',
                  'rgb(239, 68, 68)'
                ]
              }]
            },
            carePlans: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                label: 'New Care Plans',
                data: [4, 6, 8, 5, 7, 9],
                borderColor: 'rgb(59, 130, 246)',
                tension: 0.4,
                fill: false
              }]
            }
          })

          setFlaggedNotes([
            {
              id: 1,
              residentName: 'John Smith',
              issue: 'Medication schedule adjustment needed',
              priority: 'high',
              date: new Date()
            },
            {
              id: 2,
              residentName: 'Mary Johnson',
              issue: 'Changes in sleep pattern observed',
              priority: 'medium',
              date: new Date(Date.now() - 86400000)
            },
            {
              id: 3,
              residentName: 'Robert Davis',
              issue: 'Dietary requirements update',
              priority: 'low',
              date: new Date(Date.now() - 172800000)
            },
            {
              id: 4,
              residentName: 'Sarah Wilson',
              issue: 'Physical therapy progress review',
              priority: 'medium',
              date: new Date(Date.now() - 259200000)
            },
            {
              id: 5,
              residentName: 'James Brown',
              issue: 'Social activity participation decline',
              priority: 'high',
              date: new Date(Date.now() - 345600000)
            }
          ])

          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50'
      case 'low':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Coordinator Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of care plans, tasks, and communications
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiClipboard className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Care Plans</p>
              <p className="text-lg font-semibold text-gray-900">{stats.totalCarePlans}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheckSquare className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-lg font-semibold text-gray-900">{stats.totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-card">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiFlag className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Open Notes</p>
              <p className="text-lg font-semibold text-gray-900">{stats.openNotes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiMessageCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">New Messages</p>
              <p className="text-lg font-semibold text-gray-900">{stats.newMessages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Status Overview</h2>
          <div className="h-64">
            <Pie 
              data={chartData.taskStatus}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right'
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">New Care Plans This Month</h2>
          <div className="h-64">
            <Line 
              data={chartData.carePlans}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Latest Flagged Notes */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Latest Flagged Notes</h2>
          <Link
            to="/coordinator/flag-notes"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {flaggedNotes.map(note => (
            <div key={note.id} className="py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{note.residentName}</h3>
                  <p className="mt-1 text-sm text-gray-600">{note.issue}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(note.priority)}`}>
                    {note.priority.charAt(0).toUpperCase() + note.priority.slice(1)} Priority
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(note.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard