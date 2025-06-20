import { create } from 'zustand';
import api from '../lib/axios.js';

const useUserStore = create((set, get) => ({
  // State
  users: [],
  isLoading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Get all users
  getAllUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/users');
      
      if (response.data.success) {
        set({
          users: response.data.users,
          isLoading: false,
          error: null
        });
        return { success: true, data: response.data };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch users';
      set({
        isLoading: false,
        error: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/users/${userId}`, userData);
      
      if (response.data.success) {
        // Update the user in the local state
        const updatedUsers = get().users.map(user => 
          user._id === userId ? response.data.user : user
        );
        
        set({
          users: updatedUsers,
          isLoading: false,
          error: null
        });
        return { success: true, data: response.data };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update user';
      set({
        isLoading: false,
        error: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.delete(`/users/${userId}`);
      
      if (response.data.success) {
        // Remove the user from local state
        const filteredUsers = get().users.filter(user => user._id !== userId);
        
        set({
          users: filteredUsers,
          isLoading: false,
          error: null
        });
        return { success: true, data: response.data };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete user';
      set({
        isLoading: false,
        error: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/users/${userId}`);
      
      if (response.data.success) {
        set({
          isLoading: false,
          error: null
        });
        return { success: true, data: response.data };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch user';
      set({
        isLoading: false,
        error: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }
}));

export default useUserStore; 