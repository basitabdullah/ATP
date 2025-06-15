import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 10000,
  withCredentials: true, // Important: This enables sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add any request modifications here
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - could trigger logout
      console.warn('Unauthorized access - user may need to login again');
    }
    
    if (error.response?.status === 403) {
      // Forbidden - insufficient permissions
      console.warn('Access denied - insufficient permissions');
    }
    
    if (error.response?.status >= 500) {
      // Server errors
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

// API methods for different content types
export const apiJSON = api; // For JSON requests

// For multipart/form-data requests (file uploads)
export const apiFormData = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 30000, // Longer timeout for file uploads
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    // Don't set Content-Type for FormData - let browser set it with boundary
  },
});

// Add same interceptors to form data instance
apiFormData.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} FormData request to: ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

apiFormData.interceptors.response.use(
  (response) => {
    console.log(`FormData response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('FormData API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api; 