import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/axios.js';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Sign up function
      signup: async (firstName, lastName, email, password, phone = '', role = 'standard-user') => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/signup', {
            firstName,
            lastName,
            email,
            phone,
            password,
            role
          });
          
          if (response.data.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            return { success: true, data: response.data };
          }
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Signup failed';
          set({
            isLoading: false,
            error: errorMessage,
            user: null,
            isAuthenticated: false
          });
          return { success: false, error: errorMessage };
        }
      },

      // Login function
      login: async (email, password) => {
        console.log('Auth store login called with:', { email, password: '***' });
        set({ isLoading: true, error: null });
        try {
          console.log('Making API request to:', '/auth/login');
          const response = await api.post('/auth/login', {
            email,
            password
          });
          
          console.log('API response:', response.data);
          
          if (response.data.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            return { success: true, data: response.data };
          }
        } catch (error) {
          console.error('Login API error:', error);
          console.error('Error response:', error.response?.data);
          const errorMessage = error.response?.data?.message || error.message || 'Login failed';
          set({
            isLoading: false,
            error: errorMessage,
            user: null,
            isAuthenticated: false
          });
          return { success: false, error: errorMessage };
        }
      },

      // Logout function
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/auth/logout');
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
          return { success: true };
        } catch (error) {
          // Even if logout request fails, clear local state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
          return { success: true }; // Always return success for logout
        }
      },

      // Get current user info
      getMe: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get('/auth/me');
          
          if (response.data.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            return { success: true, data: response.data };
          }
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Failed to get user info';
          set({
            isLoading: false,
            error: errorMessage,
            user: null,
            isAuthenticated: false
          });
          return { success: false, error: errorMessage };
        }
      },

      // Update user profile
      updateProfile: async (userData) => {
        if (!get().user) {
          return { success: false, error: 'No user logged in' };
        }

        set({ isLoading: true, error: null });
        try {
          const userId = get().user._id;
          const response = await api.put(`/users/${userId}`, userData);
          
          if (response.data.success) {
            set({
              user: response.data.user,
              isLoading: false,
              error: null
            });
            return { success: true, data: response.data };
          }
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Profile update failed';
          set({
            isLoading: false,
            error: errorMessage
          });
          return { success: false, error: errorMessage };
        }
      },

      // Change password
      changePassword: async (passwords) => {
        if (!get().user) {
          return { success: false, error: 'No user logged in' };
        }

        set({ isLoading: true, error: null });
        try {
          const userId = get().user._id;
          const response = await api.put(`/users/${userId}/password`, passwords);
          
          if (response.data.success) {
            set({
              isLoading: false,
              error: null
            });
            return { success: true, data: response.data };
          }
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Password change failed';
          set({
            isLoading: false,
            error: errorMessage
          });
          return { success: false, error: errorMessage };
        }
      },

      // Initialize auth state (check if user is logged in)
      initializeAuth: async () => {
        // Only check if we don't already have a user
        if (get().user) return;
        
        set({ isLoading: true });
        try {
          const response = await api.get('/auth/me');
          if (response.data.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false
            });
          }
        } catch (error) {
          // If auth check fails, user is not logged in
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      },

      // Check if user has specific role
      hasRole: (role) => {
        const user = get().user;
        return user && user.role === role;
      },

      // Check if user has any of the specified roles
      hasAnyRole: (roles) => {
        const user = get().user;
        return user && roles.includes(user.role);
      },

      // Check if user is admin
      isAdmin: () => {
        const user = get().user;
        return user && user.role === 'admin';
      },

      // Check if user is editor or admin
      canEdit: () => {
        const user = get().user;
        return user && ['admin', 'editor'].includes(user.role);
      },

      // Check if user is author, editor, or admin
      canCreate: () => {
        const user = get().user;
        return user && ['admin', 'editor', 'author'].includes(user.role);
      },

      // Check if user can download news (premium users and above)
      canDownload: () => {
        const user = get().user;
        return user && ['admin', 'editor', 'author', 'premium-user'].includes(user.role);
      },

      // Check if user is premium or above
      isPremiumOrAbove: () => {
        const user = get().user;
        return user && ['admin', 'editor', 'author', 'premium-user'].includes(user.role);
      },

      // Reset store
      reset: () => set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // Don't persist loading and error states
      }),
    }
  )
);

export default useAuthStore; 