import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  FiHome,
  FiUsers,
  FiClipboard,
  FiCalendar,
  FiMessageCircle,
  FiSettings,
  FiFlag,
  FiAlertCircle,
  FiFileText,
  FiCheckSquare,
  FiSend,
  FiHeart,
  FiClock,
  FiMenu,
  FiX,
  FiMessageSquare,
  FiMapPin,
  FiUser,
} from "react-icons/fi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [pinnedMessages, setPinnedMessages] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Mock pinned messages - in real app, fetch from backend
    if (user?.role === "admin") {
      setPinnedMessages([
        {
          id: 1,
          from: "Emily Davis",
          message: "Review care plan updates",
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: 2,
          from: "Michael Wilson",
          message: "Staff schedule changes",
          timestamp: new Date(Date.now() - 7200000),
        },
      ]);
    }
  }, [user]);

  const isActive = (path) => {
    if (path === `/${user?.role}` && location.pathname === `/${user?.role}`) {
      return true;
    }
    return location.pathname.startsWith(path) && path !== `/${user?.role}`;
  };

  const getNavLinks = () => {
    if (!user) return [];

    const iconProps = {
      size: 20,
      className: "flex-shrink-0 transition-colors duration-150",
    };

    switch (user.role) {
      case "admin":
        return [
          {
            to: "/admin",
            icon: <FiHome {...iconProps} />,
            text: "Dashboard",
            color: "text-blue-500",
          },
          {
            to: "/admin/users",
            icon: <FiUsers {...iconProps} />,
            text: "Manage Users",
            color: "text-indigo-500",
          },
          {
            to: "/admin/residents",
            icon: <FiHeart {...iconProps} />,
            text: "Manage Residents",
            color: "text-pink-500",
          },
          {
            to: "/admin/shifts",
            icon: <FiCalendar {...iconProps} />,
            text: "Manage Shifts",
            color: "text-purple-500",
          },
          {
            to: "/admin/feedbacks",
            icon: <FiMessageSquare {...iconProps} />,
            text: "Feedbacks",
            color: "text-green-500",
          },
          {
            to: "/admin/visit-requests",
            icon: <FiClock {...iconProps} />,
            text: "Visit Requests",
            color: "text-yellow-500",
          },
          {
            to: "/admin/incidents",
            icon: <FiAlertCircle {...iconProps} />,
            text: "Incidents",
            color: "text-red-500",
          },
          {
            to: "/admin/messages",
            icon: <FiMessageCircle {...iconProps} />,
            text: "Messages",
            color: "text-purple-500",
          },
          {
            to: "/admin/settings",
            icon: <FiSettings {...iconProps} />,
            text: "Settings",
            color: "text-gray-500",
          },
          {
            to: "/admin/profile",
            icon: <FiUser {...iconProps} />,
            text: "My Profile",
            color: "text-gray-500",
          },
          {
            to: "/admin/family-requests",
            icon: <FiUsers {...iconProps} />,
            text: "Family Requests",
            color: "text-gray-500",
          },
        ];

      case "coordinator":
        return [
          {
            to: "/coordinator",
            icon: <FiHome {...iconProps} />,
            text: "Dashboard",
            color: "text-blue-500",
          },
          {
            to: "/coordinator/care-plans",
            icon: <FiClipboard {...iconProps} />,
            text: "Care Plans",
            color: "text-indigo-500",
          },
          {
            to: "/coordinator/tasks",
            icon: <FiCheckSquare {...iconProps} />,
            text: "Manage Tasks",
            color: "text-green-500",
          },
          {
            to: "/coordinator/flag-notes",
            icon: <FiFlag {...iconProps} />,
            text: "Flag Notes",
            color: "text-red-500",
          },
          {
            to: "/coordinator/messages",
            icon: <FiMessageCircle {...iconProps} />,
            text: "Messages",
            color: "text-purple-500",
          },
          {
            to: "/coordinator/profile",
            icon: <FiUser {...iconProps} />,
            text: "My Profile",
            color: "text-gray-500",
          },
        ];

      case "nurse":
        return [
          {
            to: "/nurse",
            icon: <FiHome {...iconProps} />,
            text: "Dashboard",
            color: "text-blue-500",
          },
          {
            to: "/nurse/shifts",
            icon: <FiCalendar {...iconProps} />,
            text: "My Shifts",
            color: "text-purple-500",
          },
          {
            to: "/nurse/shift-notes",
            icon: <FiFileText {...iconProps} />,
            text: "Shift Notes",
            color: "text-indigo-500",
          },
          {
            to: "/nurse/residents",
            icon: <FiHeart {...iconProps} />,
            text: "View Residents",
            color: "text-pink-500",
          },
          {
            to: "/nurse/incidents",
            icon: <FiAlertCircle {...iconProps} />,
            text: "Report Incidents",
            color: "text-red-500",
          },
        ];

      case "carer":
        return [
          {
            to: "/carer",
            icon: <FiHome {...iconProps} />,
            text: "Dashboard",
            color: "text-blue-500",
          },
          {
            to: "/carer/shifts",
            icon: <FiCalendar {...iconProps} />,
            text: "My Shifts",
            color: "text-purple-500",
          },
          {
            to: "/carer/shift-notes",
            icon: <FiFileText {...iconProps} />,
            text: "Shift Notes",
            color: "text-indigo-500",
          },
          {
            to: "/carer/residents",
            icon: <FiHeart {...iconProps} />,
            text: "View Residents",
            color: "text-pink-500",
          },
          {
            to: "/carer/incidents",
            icon: <FiAlertCircle {...iconProps} />,
            text: "Report Incidents",
            color: "text-red-500",
          },
        ];

      case "resident":
        return [
          {
            to: "/resident",
            icon: <FiHome {...iconProps} />,
            text: "Dashboard",
            color: "text-blue-500",
          },
          {
            to: "/resident/care-plan",
            icon: <FiClipboard {...iconProps} />,
            text: "My Care Plan",
            color: "text-indigo-500",
          },
          {
            to: "/resident/shift-notes",
            icon: <FiFileText {...iconProps} />,
            text: "Shift Notes",
            color: "text-purple-500",
          },
          {
            to: "/resident/feedback",
            icon: <FiMessageSquare {...iconProps} />,
            text: "Submit Feedback",
            color: "text-green-500",
          },
          {
            to: "/resident/incident",
            icon: <FiAlertCircle {...iconProps} />,
            text: "Report Incident",
            color: "text-red-500",
          },
        ];

      case "family":
        return [
          {
            to: "/family",
            icon: <FiHome {...iconProps} />,
            text: "Dashboard",
            color: "text-blue-500",
          },
          {
            to: "/family/resident",
            icon: <FiHeart {...iconProps} />,
            text: "Resident Profile",
            color: "text-pink-500",
          },
          {
            to: "/family/visits",
            icon: <FiClock {...iconProps} />,
            text: "Visit Requests",
            color: "text-purple-500",
          },
          {
            to: "/family/shift-notes",
            icon: <FiFileText {...iconProps} />,
            text: "Shift Notes",
            color: "text-indigo-500",
          },
        ];

      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  if (!user) return null;

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg text-gray-600 hover:text-primary-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Backdrop */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white fixed md:relative z-40 h-screen transition-all duration-300 ease-in-out shadow-lg ${
          isOpen
            ? "w-64 translate-x-0"
            : "w-0 -translate-x-full md:w-20 md:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200">
            {isOpen ? (
              <h1 className="text-xl font-display font-bold text-primary-600">
                iHealth
              </h1>
            ) : (
              <div className="hidden md:block">
                <span className="text-2xl font-bold text-primary-600">i</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      isActive(link.to)
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    <span
                      className={`${link.color} ${
                        isActive(link.to) ? "text-primary-700" : ""
                      }`}
                    >
                      {link.icon}
                    </span>
                    {isOpen && (
                      <span className="ml-3 text-sm font-medium">
                        {link.text}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Pinned Messages Section - Only show for admin */}
            {user.role === "admin" && isOpen && pinnedMessages.length > 0 && (
              <div className="mt-6 px-3">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Pinned Messages
                </h3>
                <ul className="mt-2 space-y-1">
                  {pinnedMessages.map((msg) => (
                    <li key={msg.id}>
                      <Link
                        to="/admin/messages"
                        className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50"
                        onClick={() => isMobile && setIsOpen(false)}
                      >
                        <FiMapPin className="flex-shrink-0 w-4 h-4 text-gray-400" />
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {msg.from}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {msg.message}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </nav>

          {/* User Info */}
          {isOpen && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-medium">
                    {user?.name?.charAt(0)}
                  </div>
                )}

                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
