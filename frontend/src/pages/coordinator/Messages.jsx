import React, { useState, useEffect, useRef, useContext } from 'react'
import { FiSend, FiSearch, FiClock, FiUser } from 'react-icons/fi'
import { AuthContext } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { toast } from 'react-toastify'

const Messages = () => {
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef(null)
  
  // Auto scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Mock data using exact backend model fields
        setTimeout(() => {
          setMessages([
            {
              _id: "6612message123",
              from: {
                _id: "6612coordinator123",
                name: "Coordinator Jane"
              },
              to: {
                _id: "6612admin123",
                name: "Admin John"
              },
              text: "Please review the new care plan for Mary Smith.",
              isRead: true,
              createdAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
              _id: "6612message124",
              from: {
                _id: "6612admin123",
                name: "Admin John"
              },
              to: {
                _id: "6612coordinator123",
                name: "Coordinator Jane"
              },
              text: "Care plan reviewed and approved. Please proceed with implementation.",
              isRead: true,
              createdAt: new Date(Date.now() - 3000000).toISOString()
            },
            {
              _id: "6612message125",
              from: {
                _id: "6612coordinator123",
                name: "Coordinator Jane"
              },
              to: {
                _id: "6612admin123",
                name: "Admin John"
              },
              text: "Thank you for the quick review. I'll start the implementation right away.",
              isRead: false,
              createdAt: new Date(Date.now() - 2400000).toISOString()
            }
          ])
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching messages:', error)
        toast.error('Failed to load messages')
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!newMessage.trim()) {
      return
    }

    try {
      // Mock API call - will be replaced with real endpoint
      // await axiosInstance.post('/coordinator/messages', {
      //   text: newMessage,
      //   to: adminId
      // })

      const mockMessage = {
        _id: Date.now().toString(),
        from: {
          _id: user._id,
          name: `${user.firstName} ${user.lastName}`
        },
        to: {
          _id: "6612admin123",
          name: "Admin John"
        },
        text: newMessage,
        isRead: false,
        createdAt: new Date().toISOString()
      }

      setMessages([...messages, mockMessage])
      setNewMessage('')
      scrollToBottom()
    } catch (error) {
      toast.error('Failed to send message')
    }
  }

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMs / 3600000)
    const diffDays = Math.round(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins}m ago`
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col animate-fade-in">
      <div className="flex-none">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="mt-1 text-sm text-gray-600">
          Chat with administrators
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 mt-6 bg-white rounded-lg shadow-card flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="flex-none p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <FiUser className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-medium text-gray-900">Admin</h2>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => {
              const isFromUser = message.from._id === user._id
              
              return (
                <div
                  key={message._id}
                  className={`flex ${isFromUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isFromUser
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isFromUser ? 'text-primary-100' : 'text-gray-500'
                      }`}
                    >
                      {formatMessageTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="flex-none p-4 border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              className="flex-1 form-input"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!newMessage.trim()}
            >
              <FiSend className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Messages