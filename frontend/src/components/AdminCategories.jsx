import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useLanguage, translations } from '../context/LanguageContext';
import { apiJSON } from '../lib/axios';
import useAuthStore from '../stores/authStore';

const AdminCategories = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const { user, isAuthenticated, canEdit } = useAuthStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiJSON.get('/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (error.response?.status === 401) {
        alert('You need to login first. Please go to /login');
      } else {
        alert('Error loading categories: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle add category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      setSubmitting(true);
      const response = await apiJSON.post('/categories', {
        name: newCategory.name.trim(),
        description: newCategory.description.trim()
      });

      if (response.data.success) {
        setCategories([response.data.category, ...categories]);
        setNewCategory({ name: '', description: '' });
        setShowAddForm(false);
        alert('Category added successfully!');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Error creating category: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (id, categoryName) => {
    if (!confirm(language === 'ur' ? 
      `کیا آپ واقعی "${categoryName}" کیٹگری کو حذف کرنا چاہتے ہیں؟` : 
      `Are you sure you want to delete "${categoryName}" category?`)) {
      return;
    }

    try {
      const response = await apiJSON.delete(`/categories/${id}`);
      if (response.data.success) {
        setCategories(categories.filter(cat => cat._id !== id));
        alert('Category deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category: ' + (error.response?.data?.message || error.message));
    }
  };

  // Check if user is authenticated and has permission
  if (!isAuthenticated || !user) {
    return (
      <AdminLayout currentPage="categories">
        <div className="text-center py-8">
          <div className="text-red-500 text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">You need to login to access this page.</p>
          <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Go to Login
          </a>
        </div>
      </AdminLayout>
    );
  }

  if (!canEdit()) {
    return (
      <AdminLayout currentPage="categories">
        <div className="text-center py-8">
          <div className="text-orange-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to manage categories. Only admins and editors can access this feature.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="categories">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
            <p className="text-gray-600">Manage your news categories</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Category
          </button>
        </div>

        {/* Statistics */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">📂</span>
            </div>
            <div className={language === 'ur' ? 'mr-4' : 'ml-4'}>
              <p className="text-sm font-medium text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Categories List */}
        {!loading && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
            </div>
            
            {categories.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No categories found. Add your first category!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {category.description || 'No description'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(category.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteCategory(category._id, category.name)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Add Category Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Add New Category</h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewCategory({ name: '', description: '' });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter category name"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {newCategory.name.length}/50 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter category description (optional)"
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {newCategory.description.length}/200 characters
                  </p>
                </div>

                <div className={`flex ${language === 'ur' ? 'space-x-4 space-x-reverse' : 'space-x-4'} pt-4`}>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Adding...' : 'Add Category'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewCategory({ name: '', description: '' });
                    }}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCategories; 