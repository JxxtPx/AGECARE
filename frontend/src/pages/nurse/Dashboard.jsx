import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiCalendar, FiClock, FiAlertCircle, FiFileText } from 'react-icons/fi'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ShiftCard from '../../components/common/ShiftCard'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [recentShifts, setRecentShifts] = useState([])
  const [recentIncidents, setRecentIncidents] = useState([])
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Mock data
        setTimeout(() => {
          setStats({
            totalShifts: 24,
            completedShifts: 18,
            openTasks: 3,
            incidentsReported: 2
          })

          setRecentShifts([
            {
              id: 1,
              date: new Date(),
              startTime: '07:00',
              endTime: '15:00',
              status: 'completed',
              residentName: 'John Smith',
              residentRoom: '101',
              shiftType: 'morning',
              hasNotes: true
            },
            {
              id: 2,
              date: new Date(Date.now() - 86400000),
              startTime: '15:00',
              endTime: '23:00',
              status: 'completed',
              residentName: 'Mary Johnson',
              residentRoom: '102',
              shiftType: 'afternoon',
              hasNotes: true
            }
          ])

          setRecentIncidents([
            {
              id: 1,
              date: new Date(Date.now() - 172800000),
              residentName: 'Sarah Lee',
              description: 'Minor fall during transfer',
              status: 'reported'
            }
          ])

          setChartData({
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
              {
                label: 'Completed Shifts',
                data: [3, 4, 2, 3, 3, 2, 1],
                borderColor: 'rgb(59, 130, 246)',
                tension: 0.4
              }
            ]
          })

          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nurse Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of your shifts and activities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiCalendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Shifts</p>
              <p className="text-lg font-semibold text-gray-900">{stats.totalShifts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiClock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Completed Shifts</p>
              <p className="text-lg font-semibold text-gray-900">{stats.completedShifts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiFileText className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Open Tasks</p>
              <p className="text-lg font-semibold text-gray-900">{stats.openTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-card">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiAlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Incidents Reported</p>
              <p className="text-lg font-semibold text-gray-900">{stats.incidentsReported}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Shifts Chart */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Shifts Overview</h2>
          <div className="h-64">
            <Line
              data={chartData}
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

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Link
              to="/nurse/shifts"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {recentShifts.map(shift => (
              <ShiftCard
                key={shift.id}
                shift={shift}
                compact
              />
            ))}

            {recentIncidents.map(incident => (
              <div
                key={incident.id}
                className="bg-red-50 p-4 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-red-800">
                      Incident Report: {incident.residentName}
                    </h3>
                    <p className="mt-1 text-sm text-red-600">
                      {incident.description}
                    </p>
                  </div>
                  <span className="text-xs text-red-500">
                    {new Date(incident.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard