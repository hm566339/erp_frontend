/**
 * Environment Configuration Validator
 * Ensures all required environment variables are set at runtime
 */

const requiredEnvVars = [
  'VITE_API_BASE_URL',
  'VITE_COMPANY_ID',
]

const optionalEnvVars = [
  'VITE_APP_NAME',
  'VITE_LOG_LEVEL',
]

/**
 * Validates environment variables at app startup
 */
export function validateEnvironment() {
  const missing = []
  
  for (const envVar of requiredEnvVars) {
    if (!import.meta.env[envVar]) {
      missing.push(envVar)
    }
  }
  
  if (missing.length > 0) {
    console.warn(
      `[Config] Missing required environment variables: ${missing.join(', ')}. ` +
      `The app will use default values but may not work correctly. ` +
      `Check your .env file.`
    )
  }
}

/**
 * Get environment variable with fallback
 */
export function getEnvVar(key, defaultValue = undefined) {
  const value = import.meta.env[key]
  if (!value && defaultValue === undefined) {
    console.warn(`[Config] Environment variable ${key} not found`)
  }
  return value || defaultValue
}

/**
 * Get API configuration
 */
export function getApiConfig() {
  return {
    baseURL: getEnvVar('VITE_API_BASE_URL', 'http://localhost:8080'),
    companyId: getEnvVar('VITE_COMPANY_ID', '550e8400-e29b-41d4-a716-446655440000'),
    timeout: 30000,
  }
}

/**
 * Get app configuration
 */
export function getAppConfig() {
  return {
    name: getEnvVar('VITE_APP_NAME', 'ERP Finance & Accounting'),
    logLevel: getEnvVar('VITE_LOG_LEVEL', 'warn'),
  }
}
