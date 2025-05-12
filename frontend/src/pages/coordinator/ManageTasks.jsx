import React, { useState, useEffect } from 'react'
import { FiSearch, FiFilter, FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import StatusBadge from '../../components/common/StatusBadge'
import { toast } from 'react-toastify'

const ManageTasks = () => {
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [staff, setStaff] = useState([])
  const [residents, setResidents] = useState([])
  
  // Form state using exact backend model fields
  const [formData, setFormData] = useState({
    assignedTo: '',
    resident: '',
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending'
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data using exact backend model fields
        setTimeout(() => {
          setTasks([
            {
              _id: "6612task123",
              assignedTo: {
                _id: "6612staff123",
                name: "James Brown",
                role: "nurse"
              },
              resident: {
                _id: "6612resident456",
                name: "Sarah Lee"
              },
              title: "Monitor blood pressure",
              description: "Check blood pressure twice a day and record.",
              dueDate: "2024-05-15T09:00:00Z",
              status: "pending",
              priority: "medium",
              createdAt: new Date().toISOString()
            },
            {
              _id: "6612task124",
              assignedTo: {
                _id: "6612staff124",
                name: "Emily Davis",
                role: "carer"
              },
              resident: {
                _id: "6612resident457",
                name: "John Smith"
              },
              title: "Assist with morning routine",
              description: "Help with personal hygiene and dressing.",
              dueDate: "2024-05-14T08:00:00Z",
              status: "inProgress",
              priority: "high",
              createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
              _id: "6612task125",
              assignedTo: {
                _id: "6612staff125",
                name: "Michael Wilson",
                role: "nurse"
              },
              resident: {
                _id: "6612resident458",
                name: "Mary Johnson"
              },
              title: "Medication review",
              description: "Review and update medication chart.",
              dueDate: "2024-05-16T14:00:00Z",
              status: "completed",
              priority: "low",
              createdAt: new Date(Date.now() - 172800000).toISOString()
            }
          ])

          setStaff([
            { _id: "6612staff123", name: "James Brown", role: "nurse" },
            { _id: "6612staff124", name: "Emily Davis", role: "carer" },
            { _id: "6612staff125", name: "Michael Wilson", role: "nurse" }
          ])

          setResidents([
            { _id: "6612resident456", name: "Sarah Lee" },
            { _id: "6612resident457", name: "John Smith" },
            { _id: "6612resident458", name: "Mary Johnson" }
          ])

          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching tasks:', error)
        toast.error('Failed to load tasks')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCreateTask = () => {
    setSelectedTask(null)
    setFormData({
      assignedTo: '',
      resident: '',
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'pending'
    })
    setShowModal(true)
  }

  const handleEditTask = (task) => {
    setSelectedTask(task)
    setFormData({
      assignedTo: task.assignedTo._id,
      resident: task.resident._id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.split('T')[0],
      priority: task.priority,
      status: task.status
    })
    setShowModal(true)
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        // await axiosInstance.delete(`/coordinator/tasks/${taskId}`)
        setTasks(tasks.filter(task => task._id !== taskId))
        toast.success('Task deleted successfully')
      } catch (error) {
        toast.error('Failed to delete task')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (!formData.assignedTo || !formData.resident || !formData.title || !formData.dueDate) {
        toast.error('Please fill in all required fields')
        return
      }

      if (selectedTask) {
        // await axiosInstance.put(`/coordinator/tasks/${selectedTask._id}`, formData)
        setTasks(tasks.map(task => 
          task._id === selectedTask._id 
            ? {
                ...task,
                assignedTo: staff.find(s => s._id === formData.assignedTo),
                resident: residents.find(r => r._id === formData.resident),
                title: formData.title,
                description: formData.description,
                dueDate: formData.dueDate,
                priority: formData.priority,
                status: formData.status
              }
            : task
        ))
        toast.success('Task updated successfully')
      } else {
        // const response = await axiosInstance.post('/coordinator/tasks', formData)
        const newTask = {
          _id: Date.now().toString(),
          assignedTo: staff.find(s => s._id === formData.assignedTo),
          resident: residents.find(r => r._id === formData.resident),
          title: formData.title,
          description: formData.description,
          dueDate: formData.dueDate,
          priority: formData.priority,
          status: formData.status,
          createdAt: new Date().toISOString()
        }
        setTasks([...tasks, newTask])
        toast.success('Task created successfully')
      }

      setShowModal(false)
    } catch (error) {
      toast.error('Failed to save task')
    }
  }

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

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.assignedTo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Tasks</h1>
          <p className="mt-1 text-sm text-gray-600">
            Assign and manage staff tasks
          </p>
        </div>
        <button
          onClick={handleCreateTask}
          className="btn btn-primary"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Assign New Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="form-input pl-10"
              placeholder="Search by staff or task title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="form-input pl-10"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="inProgress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resident
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {task.assignedTo.name}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                      {task.assignedTo.role}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {task.resident.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {task.title}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {task.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {selectedTask ? 'Edit Task' : 'Assign New Task'}
                      </h3>
                      <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
                          Assign To
                        </label>
                        <select
                          id="assignedTo"
                          className="mt-1 form-input"
                          value={formData.assignedTo}
                          onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                          required
                        >
                          <option value="">Select staff member</option>
                          {staff.map(member => (
                            <option key={member._id} value={member._id}>
                              {member.name} ({member.role})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="resident" className="block text-sm font-medium text-gray-700">
                          Resident
                        </label>
                        <select
                          id="resident"
                          className="mt-1 form-input"
                          value={formData.resident}
                          onChange={(e) => setFormData({ ...formData, resident: e.target.value })}
                          required
                        >
                          <option value="">Select resident</option>
                          {residents.map(resident => (
                            <option key={resident._id} value={resident._id}>
                              {resident.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Task Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          className="mt-1 form-input"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          id="description"
                          rows={3}
                          className="mt-1 form-input"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>

                      <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                          Due Date
                        </label>
                        <input
                          type="datetime-local"
                          id="dueDate"
                          className="mt-1 form-input"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                          Priority
                        </label>
                        <select
                          id="priority"
                          className="mt-1 form-input"
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          required
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          id="status"
                          className="mt-1 form-input"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          required
                        >
                          <option value="pending">Pending</option>
                          <option value="inProgress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {selectedTask ? 'Update Task' : 'Create Task'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageTasks