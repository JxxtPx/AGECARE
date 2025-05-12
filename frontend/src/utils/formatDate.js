/**
 * Format a date string or Date object to a human-readable format
 * @param {string|Date} date - The date to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    includeTime: false,
    relative: false,
    format: 'medium' // 'short', 'medium', 'long', 'full'
  }
  
  const config = { ...defaultOptions, ...options }
  
  if (!date) return ''
  
  const dateObj = date instanceof Date ? date : new Date(date)
  
  // Check for invalid date
  if (isNaN(dateObj.getTime())) return 'Invalid date'
  
  // If relative formatting is requested
  if (config.relative) {
    return formatRelativeTime(dateObj)
  }
  
  // Otherwise, use regular date formatting
  let dateFormatOptions = {}
  
  switch (config.format) {
    case 'short':
      dateFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' }
      break
    case 'medium':
      dateFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
      break
    case 'long':
      dateFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }
      break
    case 'full':
      dateFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
      break
    default:
      dateFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  }
  
  // Add time if requested
  if (config.includeTime) {
    dateFormatOptions.hour = 'numeric'
    dateFormatOptions.minute = 'numeric'
    dateFormatOptions.hour12 = true
  }
  
  return new Intl.DateTimeFormat('en-US', dateFormatOptions).format(dateObj)
}

/**
 * Format a date to a relative time string (e.g. "5 minutes ago")
 * @param {Date} date - The date to format
 * @returns {string} Relative time string
 */
const formatRelativeTime = (date) => {
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.round(diffMs / 1000)
  const diffMin = Math.round(diffSec / 60)
  const diffHour = Math.round(diffMin / 60)
  const diffDay = Math.round(diffHour / 24)
  const diffMonth = Math.round(diffDay / 30)
  const diffYear = Math.round(diffDay / 365)
  
  // Future dates
  if (diffMs < 0) {
    const absDiffMs = Math.abs(diffMs)
    const absDiffSec = Math.round(absDiffMs / 1000)
    const absDiffMin = Math.round(absDiffSec / 60)
    const absDiffHour = Math.round(absDiffMin / 60)
    const absDiffDay = Math.round(absDiffHour / 24)
    
    if (absDiffSec < 60) return `in ${absDiffSec} seconds`
    if (absDiffMin < 60) return `in ${absDiffMin} minutes`
    if (absDiffHour < 24) return `in ${absDiffHour} hours`
    if (absDiffDay < 30) return `in ${absDiffDay} days`
    
    // For longer future periods, use standard date format
    return formatDate(date, { format: 'medium' })
  }
  
  // Past dates
  if (diffSec < 60) return `${diffSec} seconds ago`
  if (diffMin < 60) return `${diffMin} minutes ago`
  if (diffHour < 24) return `${diffHour} hours ago`
  if (diffDay < 7) return `${diffDay} days ago`
  
  // For older dates
  if (diffDay < 30) {
    const weeks = Math.floor(diffDay / 7)
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  }
  
  if (diffMonth < 12) return `${diffMonth} months ago`
  return `${diffYear} ${diffYear === 1 ? 'year' : 'years'} ago`
}

/**
 * Format a time string (HH:MM)
 * @param {string} timeString - Time string in format "HH:MM"
 * @param {boolean} use12Hour - Whether to use 12-hour format
 * @returns {string} Formatted time string
 */
export const formatTime = (timeString, use12Hour = true) => {
  if (!timeString) return ''
  
  try {
    // Parse the time string
    const [hours, minutes] = timeString.split(':').map(num => parseInt(num, 10))
    
    if (isNaN(hours) || isNaN(minutes)) {
      return timeString // Return original if parsing fails
    }
    
    if (use12Hour) {
      const period = hours >= 12 ? 'PM' : 'AM'
      const displayHours = hours % 12 || 12
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
    } else {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    }
  } catch (err) {
    return timeString
  }
}

/**
 * Format a date range
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @param {object} options - Formatting options
 * @returns {string} Formatted date range
 */
export const formatDateRange = (startDate, endDate, options = {}) => {
  const defaultOptions = {
    includeTime: false,
    format: 'medium'
  }
  
  const config = { ...defaultOptions, ...options }
  
  if (!startDate && !endDate) return ''
  if (!startDate) return `Until ${formatDate(endDate, config)}`
  if (!endDate) return `From ${formatDate(startDate, config)}`
  
  const startDateObj = startDate instanceof Date ? startDate : new Date(startDate)
  const endDateObj = endDate instanceof Date ? endDate : new Date(endDate)
  
  // Check if same day
  const sameDay = startDateObj.toDateString() === endDateObj.toDateString()
  
  if (sameDay && config.includeTime) {
    // Same day, show one date with time range
    return `${formatDate(startDateObj, { ...config, includeTime: false })} ${formatTime(startDateObj.getHours() + ':' + startDateObj.getMinutes().toString().padStart(2, '0'))} - ${formatTime(endDateObj.getHours() + ':' + endDateObj.getMinutes().toString().padStart(2, '0'))}`
  } else {
    // Different days
    return `${formatDate(startDateObj, config)} - ${formatDate(endDateObj, config)}`
  }
}

export default {
  formatDate,
  formatTime,
  formatDateRange
}