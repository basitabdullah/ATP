import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useLanguage, translations } from '../context/LanguageContext';
import { apiJSON, apiFormData } from '../lib/axios';

// Simple Toast component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 min-w-[300px]`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
          ✕
        </button>
      </div>
    </div>
  );
};

const AdminNews = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [newArticle, setNewArticle] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    description: '',
    tags: '',
    image: null,
    status: 'draft'
  });

  const [newsList, setNewsList] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });

  const categories = [
    { value: 'technology', label: language === 'ur' ? 'ٹیکنالوجی' : 'Technology' },
    { value: 'business', label: language === 'ur' ? 'کاروبار' : 'Business' },
    { value: 'sports', label: language === 'ur' ? 'کھیل' : 'Sports' },
    { value: 'entertainment', label: language === 'ur' ? 'تفریح' : 'Entertainment' },
    { value: 'health', label: language === 'ur' ? 'صحت' : 'Health' },
    { value: 'politics', label: language === 'ur' ? 'سیاست' : 'Politics' },
    { value: 'science', label: language === 'ur' ? 'سائنس' : 'Science' },
    { value: 'other', label: language === 'ur' ? 'دیگر' : 'Other' }
  ];

  // Toast notification helper
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // Fetch news from API
  const fetchNews = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page: page.toString(),
        limit: pagination.limit.toString(),
      };

      if (searchTerm) params.search = searchTerm;
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterCategory !== 'all') params.category = filterCategory;

      const response = await apiJSON.get('/news', { params });
      const data = response.data;
      
      setNewsList(data.news || []);
      setPagination({
        currentPage: data.currentPage || 1,
        totalPages: data.totalPages || 1,
        total: data.total || 0,
        limit: pagination.limit
      });
    } catch (error) {
      console.error('Error fetching news:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch news';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load news on component mount and when filters change
  useEffect(() => {
    fetchNews(1);
  }, [searchTerm, filterStatus, filterCategory]);

  // Handle form submission for creating news
  const handleAddArticle = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Client-side validation before sending
    const validationErrors = [];
    
    if (!newArticle.title.trim() || newArticle.title.length < 5 || newArticle.title.length > 200) {
      validationErrors.push('Title must be between 5 and 200 characters');
    }
    
    if (!newArticle.excerpt.trim() || newArticle.excerpt.length < 10 || newArticle.excerpt.length > 300) {
      validationErrors.push('Excerpt must be between 10 and 300 characters');
    }
    
    if (!newArticle.content.trim() || newArticle.content.length < 50) {
      validationErrors.push('Content must be at least 50 characters long');
    }
    
    if (!newArticle.category) {
      validationErrors.push('Please select a category');
    }
    
    if (newArticle.description && newArticle.description.length > 500) {
      validationErrors.push('Description cannot exceed 500 characters');
    }

    if (validationErrors.length > 0) {
      showToast(validationErrors.join(', '), 'error');
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', newArticle.title.trim());
      formData.append('excerpt', newArticle.excerpt.trim());
      formData.append('content', newArticle.content.trim());
      formData.append('category', newArticle.category);
      formData.append('description', newArticle.description.trim());
      formData.append('tags', newArticle.tags.trim());
      formData.append('status', newArticle.status);
      
      if (newArticle.image) {
        formData.append('image', newArticle.image);
      }

      const response = await apiFormData.post('/news', formData);
      
      showToast(language === 'ur' ? 'خبر کامیابی سے شامل کی گئی!' : 'News added successfully!', 'success');
      setNewArticle({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        description: '',
        tags: '',
        image: null,
        status: 'draft'
      });
      setShowAddForm(false);
      fetchNews(pagination.currentPage);
    } catch (error) {
      console.error('Error creating news:', error);
      
      // Show detailed validation errors if available
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        showToast(`Validation errors: ${errorMessages}`, 'error');
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to create news';
        showToast(errorMessage, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form submission for updating news
  const handleUpdateArticle = async (e) => {
    e.preventDefault();
    if (!editingNews) return;
    
    setSubmitting(true);

    // Client-side validation before sending
    const validationErrors = [];
    
    if (!newArticle.title.trim() || newArticle.title.length < 5 || newArticle.title.length > 200) {
      validationErrors.push('Title must be between 5 and 200 characters');
    }
    
    if (!newArticle.excerpt.trim() || newArticle.excerpt.length < 10 || newArticle.excerpt.length > 300) {
      validationErrors.push('Excerpt must be between 10 and 300 characters');
    }
    
    if (!newArticle.content.trim() || newArticle.content.length < 50) {
      validationErrors.push('Content must be at least 50 characters long');
    }
    
    if (!newArticle.category) {
      validationErrors.push('Please select a category');
    }
    
    if (newArticle.description && newArticle.description.length > 500) {
      validationErrors.push('Description cannot exceed 500 characters');
    }

    if (validationErrors.length > 0) {
      showToast(validationErrors.join(', '), 'error');
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', newArticle.title.trim());
      formData.append('excerpt', newArticle.excerpt.trim());
      formData.append('content', newArticle.content.trim());
      formData.append('category', newArticle.category);
      formData.append('description', newArticle.description.trim());
      formData.append('tags', newArticle.tags.trim());
      formData.append('status', newArticle.status);
      
      if (newArticle.image && typeof newArticle.image !== 'string') {
        formData.append('image', newArticle.image);
      }

      const response = await apiFormData.put(`/news/${editingNews._id}`, formData);
      
      showToast(language === 'ur' ? 'خبر کامیابی سے اپڈیٹ کی گئی!' : 'News updated successfully!', 'success');
      setNewArticle({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        description: '',
        tags: '',
        image: null,
        status: 'draft'
      });
      setEditingNews(null);
      setShowAddForm(false);
      fetchNews(pagination.currentPage);
    } catch (error) {
      console.error('Error updating news:', error);
      
      // Show detailed validation errors if available
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        showToast(`Validation errors: ${errorMessages}`, 'error');
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to update news';
        showToast(errorMessage, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete news
  const handleDeleteNews = async (id) => {
    if (confirm(language === 'ur' ? 'کیا آپ واقعی اس خبر کو حذف کرنا چاہتے ہیں؟' : 'Do you really want to delete this news?')) {
      try {
        await apiJSON.delete(`/news/${id}`);
        showToast(language === 'ur' ? 'خبر کامیابی سے حذف کی گئی!' : 'News deleted successfully!', 'success');
        fetchNews(pagination.currentPage);
      } catch (error) {
        console.error('Error deleting news:', error);
        const errorMessage = error.response?.data?.message || 'Failed to delete news';
        showToast(errorMessage, 'error');
      }
    }
  };

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      await apiJSON.patch(`/news/${id}/status`, { status: newStatus });
      fetchNews(pagination.currentPage);
      showToast(
        language === 'ur' ? 
          `خبر کی حالت کامیابی سے ${newStatus === 'published' ? 'شائع شدہ' : 'مسودہ'} میں تبدیل کی گئی!` : 
          `News status updated to ${newStatus} successfully!`, 
        'success'
      );
    } catch (error) {
      console.error('Error updating status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update status';
      showToast(errorMessage, 'error');
    }
  };

  // Handle edit news
  const handleEditNews = (news) => {
    setEditingNews(news);
    setNewArticle({
      title: news.title,
      excerpt: news.excerpt,
      content: news.content,
      category: news.category,
      description: news.description || '',
      tags: Array.isArray(news.tags) ? news.tags.join(', ') : '',
      image: news.image || null,
      status: news.status
    });
    setShowAddForm(true);
  };

  // Handle file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showToast('Please select a valid image file (JPEG, PNG, GIF, WebP)', 'error');
        e.target.value = '';
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be less than 5MB', 'error');
        e.target.value = '';
        return;
      }
      
      setNewArticle({...newArticle, image: file});
    }
  };

  // Reset form
  const resetForm = () => {
    setNewArticle({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      description: '',
      tags: '',
      image: null,
      status: 'draft'
    });
    setEditingNews(null);
    setShowAddForm(false);
  };

  const filteredNews = newsList;

  return (
    <AdminLayout currentPage="news">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast} 
        />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t.newsManagement}</h1>
            <p className="text-gray-600">{t.newsManagementDesc}</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t.addNewsButton}
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.search}</label>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.status}</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{t.all}</option>
                <option value="published">{t.published}</option>
                <option value="draft">{t.draft}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.category}</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{t.allCategories}</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* News Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {t.title}
                  </th>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {t.category}
                  </th>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {t.status}
                  </th>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {t.views}
                  </th>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {t.date}
                  </th>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNews.length === 0 && !loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      {language === 'ur' ? 'کوئی خبر نہیں ملی' : 'No news found'}
                    </td>
                  </tr>
                ) : (
                  filteredNews.map((news) => (
                    <tr key={news._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {news.image && (
                            <img
                              src={`http://localhost:4000/uploads/${news.image}`}
                              alt={news.title}
                              className="h-12 w-12 rounded-lg object-cover mr-4"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{news.title}</div>
                            <div className="text-sm text-gray-500">{news.excerpt?.substring(0, 100)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {categories.find(cat => cat.value === news.category)?.label || news.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={news.status}
                          onChange={(e) => handleStatusChange(news._id, e.target.value)}
                          className={`text-xs font-medium rounded-full px-2 py-1 ${
                            news.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          <option value="draft">{t.draft}</option>
                          <option value="published">{t.published}</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {news.views || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(news.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 space-x-reverse">
                          <button 
                            onClick={() => handleEditNews(news)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            {t.edit}
                          </button>
                          <button 
                            onClick={() => handleDeleteNews(news._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            {t.delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => fetchNews(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 text-gray-600 disabled:opacity-50"
            >
              {language === 'ur' ? 'پچھلا' : 'Previous'}
            </button>
            <span className="text-sm text-gray-600">
              {language === 'ur' 
                ? `صفحہ ${pagination.currentPage} از ${pagination.totalPages}` 
                : `Page ${pagination.currentPage} of ${pagination.totalPages}`
              }
            </span>
            <button
              onClick={() => fetchNews(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 rounded bg-gray-200 text-gray-600 disabled:opacity-50"
            >
              {language === 'ur' ? 'اگلا' : 'Next'}
            </button>
          </div>
        )}

        {/* Add/Edit News Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingNews ? 
                    (language === 'ur' ? 'خبر میں ترمیم' : 'Edit News') : 
                    t.addNewsButton
                  }
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={editingNews ? handleUpdateArticle : handleAddArticle} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.title} *</label>
                    <input
                      type="text"
                      required
                      value={newArticle.title}
                      onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={language === 'ur' ? 'خبر کا عنوان درج کریں' : 'Enter news title'}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {newArticle.title.length}/200 characters (minimum 5)
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.category} *</label>
                    <select
                      required
                      value={newArticle.category}
                      onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">{language === 'ur' ? 'کیٹگری منتخب کریں' : 'Select Category'}</option>
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>{category.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ur' ? 'خلاصہ' : 'Excerpt'} *
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={newArticle.excerpt}
                    onChange={(e) => setNewArticle({...newArticle, excerpt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={language === 'ur' ? 'خبر کا مختصر خلاصہ' : 'Brief summary of the news'}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {newArticle.excerpt.length}/300 characters (minimum 10)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ur' ? 'تفصیل' : 'Description'}
                  </label>
                  <textarea
                    rows="2"
                    value={newArticle.description}
                    onChange={(e) => setNewArticle({...newArticle, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={language === 'ur' ? 'SEO کے لیے تفصیل' : 'Meta description for SEO'}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {newArticle.description.length}/500 characters (optional)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ur' ? 'مواد' : 'Content'} *
                  </label>
                  <textarea
                    required
                    rows="8"
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={language === 'ur' ? 'خبر کا مکمل مواد' : 'Full news content'}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {newArticle.content.length} characters (minimum 50)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ur' ? 'ٹیگز' : 'Tags'}
                    </label>
                    <input
                      type="text"
                      value={newArticle.tags}
                      onChange={(e) => setNewArticle({...newArticle, tags: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={language === 'ur' ? 'کاما سے الگ کریں' : 'Separate with commas'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ur' ? 'تصویر' : 'Image'}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'ur' ? 'زیادہ سے زیادہ 5MB، JPEG, PNG, GIF, WebP' : 'Max 5MB, JPEG, PNG, GIF, WebP'}
                    </p>
                    {editingNews && editingNews.image && (
                      <div className="mt-2">
                        <img 
                          src={`http://localhost:4000/uploads/${editingNews.image}`} 
                          alt="Current" 
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                        <p className="text-xs text-gray-500">
                          {language === 'ur' ? 'موجودہ تصویر' : 'Current image'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.status}</label>
                  <select
                    value={newArticle.status}
                    onChange={(e) => setNewArticle({...newArticle, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">{t.draft}</option>
                    <option value="published">{t.published}</option>
                  </select>
                </div>

                <div className="flex space-x-4 space-x-reverse pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 
                      (language === 'ur' ? 'محفوظ کر رہے ہیں...' : 'Saving...') : 
                      (editingNews ? 
                        (language === 'ur' ? 'اپڈیٹ کریں' : 'Update') : 
                        t.save
                      )
                    }
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {t.cancel}
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

export default AdminNews; 