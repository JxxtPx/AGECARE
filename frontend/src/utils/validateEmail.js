/**
 * Validate an email address
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
export const validateEmail = (email) => {
  if (!email) return false
  
  // Basic email regex pattern
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(email)
}

/**
 * Check if a string contains an email address
 * @param {string} text - The text to check
 * @returns {boolean} Whether the text contains an email
 */
export const containsEmail = (text) => {
  if (!text) return false
  
  const pattern = /[^\s@]+@[^\s@]+\.[^\s@]+/
  return pattern.test(text)
}

/**
 * Extract email addresses from a string
 * @param {string} text - The text to extract from
 * @returns {Array} Array of extracted email addresses
 */
export const extractEmails = (text) => {
  if (!text) return []
  
  const pattern = /[^\s@]+@[^\s@]+\.[^\s@]+/g
  return text.match(pattern) || []
}

/**
 * Mask an email address for privacy
 * @param {string} email - The email to mask
 * @returns {string} Masked email (e.g. j***@example.com)
 */
export const maskEmail = (email) => {
  if (!email || !validateEmail(email)) return email
  
  const parts = email.split('@')
  if (parts.length !== 2) return email
  
  const [name, domain] = parts
  
  if (name.length <= 1) {
    return `${name[0]}***@${domain}`
  }
  
  return `${name[0]}${Array(name.length).join('*')}@${domain}`
}

export default {
  validateEmail,
  containsEmail,
  extractEmails,
  maskEmail
}