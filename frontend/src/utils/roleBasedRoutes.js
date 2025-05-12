/**
 * Get sidebar navigation links based on user role
 * @param {string} role - User role
 * @returns {Array} Array of navigation link objects
 */
export const getSidebarLinks = (role) => {
  if (!role) return []
  
  // Default routes shared by multiple roles
  const defaultRoutes = [
    { 
      to: '/', 
      text: 'Dashboard', 
      icon: 'home'
    }
  ]
  
  switch (role.toLowerCase()) {
    case 'admin':
      return [
        ...defaultRoutes,
        { to: '/admin/users', text: 'Manage Users', icon: 'users' },
        { to: '/admin/residents', text: 'Manage Residents', icon: 'heart' },
        { to: '/admin/shifts', text: 'Manage Shifts', icon: 'calendar' },
        { to: '/admin/feedbacks', text: 'Feedbacks', icon: 'message-square' },
        { to: '/admin/visit-requests', text: 'Visit Requests', icon: 'clock' },
        { to: '/admin/incidents', text: 'Incidents', icon: 'alert-circle' },
        { to: '/admin/messages', text: 'Messages', icon: 'message-circle' },
        { to: '/admin/settings', text: 'Settings', icon: 'settings' }
      ]
    
    case 'coordinator':
      return [
        ...defaultRoutes,
        { to: '/coordinator/care-plans', text: 'Care Plans', icon: 'clipboard' },
        { to: '/coordinator/tasks', text: 'Manage Tasks', icon: 'check-square' },
        { to: '/coordinator/flag-notes', text: 'Flag Shift Notes', icon: 'flag' },
        { to: '/coordinator/messages', text: 'Messages', icon: 'message-circle' }
      ]
    
    case 'nurse':
      return [
        ...defaultRoutes,
        { to: '/nurse/shifts', text: 'My Shifts', icon: 'calendar' },
        { to: '/nurse/shift-notes', text: 'Shift Notes', icon: 'file-text' },
        { to: '/nurse/residents', text: 'View Residents', icon: 'heart' },
        { to: '/nurse/incidents', text: 'Report Incidents', icon: 'alert-circle' }
      ]
    
    case 'carer':
      return [
        ...defaultRoutes,
        { to: '/carer/shifts', text: 'My Shifts', icon: 'calendar' },
        { to: '/carer/shift-notes', text: 'Shift Notes', icon: 'file-text' },
        { to: '/carer/residents', text: 'View Residents', icon: 'heart' },
        { to: '/carer/incidents', text: 'Report Incidents', icon: 'alert-circle' }
      ]
    
    case 'resident':
      return [
        ...defaultRoutes,
        { to: '/resident/care-plan', text: 'My Care Plan', icon: 'clipboard' },
        { to: '/resident/shift-notes', text: 'Shift Notes', icon: 'file-text' },
        { to: '/resident/feedback', text: 'Submit Feedback', icon: 'message-square' },
        { to: '/resident/incident', text: 'Report Incident', icon: 'alert-circle' }
      ]
    
    case 'family':
      return [
        ...defaultRoutes,
        { to: '/family/resident', text: 'Resident Profile', icon: 'heart' },
        { to: '/family/visits', text: 'Visit Requests', icon: 'clock' },
        { to: '/family/shift-notes', text: 'Shift Notes', icon: 'file-text' }
      ]
    
    default:
      return defaultRoutes
  }
}

/**
 * Check if a user has permission to access a route
 * @param {string} route - Route path
 * @param {string} userRole - User role
 * @returns {boolean} Whether the user has permission
 */
export const hasRoutePermission = (route, userRole) => {
  if (!route || !userRole) return false
  
  // Public routes that all authenticated users can access
  const publicRoutes = [
    '/profile', 
    '/settings',
    '/notifications'
  ]
  
  if (publicRoutes.includes(route)) return true
  
  // Role-specific route patterns
  const roleRoutePatterns = {
    admin: ['/admin', '/reports'],
    coordinator: ['/coordinator'],
    nurse: ['/nurse'],
    carer: ['/carer'],
    resident: ['/resident'],
    family: ['/family']
  }
  
  // Super admin has access to everything
  if (userRole === 'admin') return true
  
  // Check if route starts with the user's role
  if (route.startsWith(`/${userRole}`)) return true
  
  // Check for specific exceptions
  const userPatterns = roleRoutePatterns[userRole] || []
  return userPatterns.some(pattern => route.startsWith(pattern))
}

/**
 * Get the default route for a user based on their role
 * @param {string} role - User role
 * @returns {string} Default route path
 */
export const getDefaultRoute = (role) => {
  if (!role) return '/login'
  
  switch (role.toLowerCase()) {
    case 'admin':
      return '/admin'
    case 'coordinator':
      return '/coordinator'
    case 'nurse':
      return '/nurse'
    case 'carer':
      return '/carer'
    case 'resident':
      return '/resident'
    case 'family':
      return '/family'
    default:
      return '/login'
  }
}

export default {
  getSidebarLinks,
  hasRoutePermission,
  getDefaultRoute
}