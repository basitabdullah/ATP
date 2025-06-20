import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useLanguage, translations } from '../context/LanguageContext';
import { apiJSON, apiFormData } from '../lib/axios';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiCalendar, 
  FiSettings,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiTag,
  FiBarChart,
  FiX
} from 'react-icons/fi';
import { 
  MdOutlineArticle, 
  MdOutlineCategory,
  MdOutlineVisibility 
} from 'react-icons/md';
import { IoNewspaperOutline } from 'react-icons/io5';

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
          <FiX />
        </button>
      </div>
    </div>
  );
};

// Helper function for category colors
const getCategoryColor = (category) => {
  const colors = {
    technology: { bg: '#EBF8FF', text: '#1E40AF', border: '#BFDBFE' },
    business: { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
    sports: { bg: '#FEF3F2', text: '#DC2626', border: '#FCA5A5' },
    entertainment: { bg: '#FDF4FF', text: '#A21CAF', border: '#DDD6FE' },
    health: { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
    politics: { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
    science: { bg: '#F0F9FF', text: '#0284C7', border: '#BAE6FD' },
    important: { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },
    'market-updates': { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
    other: { bg: '#F9FAFB', text: '#374151', border: '#D1D5DB' }
  };
  return colors[category] || colors.other;
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
    { value: 'important', label: language === 'ur' ? 'اہم خبریں' : 'Important' },
    { value: 'market-updates', label: language === 'ur' ? 'مارکیٹ اپڈیٹس' : 'Market Updates' },
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className={`space-y-3 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
            <h1 className={`text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${language === 'ur' ? 'font-urdu leading-relaxed' : 'font-english'}`}>
              {t.newsManagement}
            </h1>
            <p className={`text-lg text-gray-600 max-w-2xl ${language === 'ur' ? 'font-urdu leading-relaxed' : 'font-english'}`}>
              {language === 'ur' ? 'تمام خبروں کو دیکھیں، ان میں ترمیم کریں اور نئی خبریں شامل کریں' : 'View, edit and manage all news articles with advanced filtering and search capabilities'}
            </p>
            <div className={`flex items-center gap-4 text-sm text-gray-500 ${language === 'ur' ? 'font-urdu' : 'font-english'}`}>
              <div className="flex items-center gap-2">
                <span className="text-green-500">●</span>
                <span>{newsList.filter(news => news.status === 'published').length} {language === 'ur' ? 'شائع شدہ' : 'Published'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">●</span>
                <span>{newsList.filter(news => news.status === 'draft').length} {language === 'ur' ? 'مسودہ' : 'Draft'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-500">●</span>
                <span>{newsList.length} {language === 'ur' ? 'کل خبریں' : 'Total'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className={`btn-primary px-6 py-3 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center gap-3 shadow-lg ${language === 'ur' ? 'font-urdu' : 'font-english'}`}
          >
            <FiPlus className="text-xl" />
            <span className="font-semibold">{t.addNewsButton}</span>
          </button>
        </div>

        {/* Enhanced Filters */}
        <div className="glass-card rounded-2xl p-6 border border-gray-200/50 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <FiFilter className="text-2xl text-blue-600" />
            <h2 className={`text-xl font-semibold text-gray-800 ${language === 'ur' ? 'font-urdu' : 'font-english'}`}>
              {language === 'ur' ? 'تلاش اور فلٹر' : 'Search & Filter'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className={`block text-sm font-semibold text-gray-700 ${language === 'ur' ? 'font-urdu text-right' : 'font-english'}`}>
                <span className="flex items-center gap-2">
                  <FiSearch className="text-blue-600" />
                  <span>{t.search}</span>
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm ${language === 'ur' ? 'font-urdu text-right pr-12' : 'font-english pl-12'}`}
                />
                <div className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${language === 'ur' ? 'left-3' : 'left-3'}`}>
                  <FiSearch />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className={`block text-sm font-semibold text-gray-700 ${language === 'ur' ? 'font-urdu text-right' : 'font-english'}`}>
                <span className="flex items-center gap-2">
                  <FiBarChart className="text-green-600" />
                  <span>{t.status}</span>
                </span>
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm ${language === 'ur' ? 'font-urdu text-right' : 'font-english'}`}
              >
                <option value="all">{t.all}</option>
                <option value="published">{t.published}</option>
                <option value="draft">{t.draft}</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className={`block text-sm font-semibold text-gray-700 ${language === 'ur' ? 'font-urdu text-right' : 'font-english'}`}>
                <span className="flex items-center gap-2">
                  <FiTag className="text-purple-600" />
                  <span>{t.category}</span>
                </span>
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm ${language === 'ur' ? 'font-urdu text-right' : 'font-english'}`}
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className={`px-8 py-4 ${language === 'ur' ? 'text-right' : 'text-left'} text-sm font-semibold text-gray-700 tracking-wide ${language === 'ur' ? 'font-urdu' : ''}`}>
                    <div className="flex items-center gap-2">
                      <MdOutlineArticle className="text-blue-600 text-lg" />
                      <span>{t.title}</span>
                    </div>
                  </th>
                  <th className={`px-6 py-4 ${language === 'ur' ? 'text-right' : 'text-left'} text-sm font-semibold text-gray-700 tracking-wide ${language === 'ur' ? 'font-urdu' : ''}`}>
                    <div className="flex items-center gap-2">
                      <FiTag className="text-purple-600 text-lg" />
                      <span>{t.category}</span>
                    </div>
                  </th>
                  <th className={`px-6 py-4 ${language === 'ur' ? 'text-right' : 'text-left'} text-sm font-semibold text-gray-700 tracking-wide ${language === 'ur' ? 'font-urdu' : ''}`}>
                    <div className="flex items-center gap-2">
                      <FiBarChart className="text-green-600 text-lg" />
                      <span>{t.status}</span>
                    </div>
                  </th>
                  <th className={`px-6 py-4 ${language === 'ur' ? 'text-right' : 'text-left'} text-sm font-semibold text-gray-700 tracking-wide ${language === 'ur' ? 'font-urdu' : ''}`}>
                    <div className="flex items-center gap-2">
                      <FiEye className="text-orange-600 text-lg" />
                      <span>{t.views}</span>
                    </div>
                  </th>
                  <th className={`px-6 py-4 ${language === 'ur' ? 'text-right' : 'text-left'} text-sm font-semibold text-gray-700 tracking-wide ${language === 'ur' ? 'font-urdu' : ''}`}>
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-indigo-600 text-lg" />
                      <span>{t.date}</span>
                    </div>
                  </th>
                  <th className={`px-6 py-4 ${language === 'ur' ? 'text-right' : 'text-left'} text-sm font-semibold text-gray-700 tracking-wide ${language === 'ur' ? 'font-urdu' : ''}`}>
                    <div className="flex items-center gap-2">
                      <FiSettings className="text-red-600 text-lg" />
                      <span>{t.actions}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredNews.length === 0 && !loading ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <IoNewspaperOutline className="text-6xl mb-4 text-gray-300" />
                        <p className={`text-lg font-medium text-gray-500 mb-2 ${language === 'ur' ? 'font-urdu' : ''}`}>
                          {language === 'ur' ? 'کوئی خبر نہیں ملی' : 'No news found'}
                        </p>
                        <p className={`text-sm text-gray-400 ${language === 'ur' ? 'font-urdu' : ''}`}>
                          {language === 'ur' ? 'نئی خبر شامل کرنے کے لیے اوپر بٹن دبائیں' : 'Click the button above to add your first news article'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredNews.map((news, index) => (
                    <tr key={news._id} className={`hover:bg-blue-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          {news.image ? (
                            <img
                              src={`http://localhost:4000/uploads/${news.image}`}
                              alt={news.title}
                              className="h-16 w-16 rounded-xl object-cover border-2 border-gray-200 shadow-sm"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-gray-200">
                              <IoNewspaperOutline className="text-2xl text-blue-600" />
                            </div>
                          )}
                          <div className={`flex-1 min-w-0 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                            <h3 className={`text-base font-semibold text-gray-900 mb-2 line-clamp-2 ${language === 'ur' ? 'font-urdu leading-relaxed' : ''}`}>
                              {news.title}
                            </h3>
                            <p className={`text-sm text-gray-600 line-clamp-2 leading-relaxed ${language === 'ur' ? 'font-urdu' : ''}`}>
                              {news.excerpt?.substring(0, 120)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full border ${language === 'ur' ? 'font-urdu' : ''}`} 
                              style={{
                                backgroundColor: getCategoryColor(news.category).bg,
                                color: getCategoryColor(news.category).text,
                                borderColor: getCategoryColor(news.category).border
                              }}>
                          {categories.find(cat => cat.value === news.category)?.label || news.category}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <select
                          value={news.status}
                          onChange={(e) => handleStatusChange(news._id, e.target.value)}
                          className={`text-sm font-medium rounded-full px-3 py-1.5 border-0 cursor-pointer transition-all duration-200 ${language === 'ur' ? 'font-urdu' : ''} ${
                            news.status === 'published'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          }`}
                        >
                          <option value="draft">{t.draft}</option>
                          <option value="published">{t.published}</option>
                        </select>
                      </td>
                      <td className="px-6 py-6">
                        <div className={`flex items-center gap-2 ${language === 'ur' ? 'font-urdu' : ''}`}>
                          <FiEye className="text-lg text-blue-600" />
                          <span className="text-sm font-semibold text-gray-900">
                            {(news.views || 0).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className={`text-sm text-gray-600 ${language === 'ur' ? 'font-urdu text-right' : ''}`}>
                          <div className="font-medium">
                            {new Date(news.createdAt).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(news.createdAt).toLocaleTimeString(language === 'ur' ? 'ur-PK' : 'en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleEditNews(news)}
                            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 ${language === 'ur' ? 'font-urdu' : ''}`}
                          >
                            <FiEdit2 className="text-sm" />
                            <span>{t.edit}</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteNews(news._id)}
                            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 ${language === 'ur' ? 'font-urdu' : ''}`}
                          >
                            <FiTrash2 className="text-sm" />
                            <span>{t.delete}</span>
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

        {/* Enhanced Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => fetchNews(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm ${language === 'ur' ? 'font-urdu' : 'font-english'}`}
            >
              <FiChevronLeft className={language === 'ur' ? 'rotate-180' : ''} />
              <span className="font-medium">{language === 'ur' ? 'پچھلا' : 'Previous'}</span>
            </button>
            
            <div className={`flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl ${language === 'ur' ? 'font-urdu' : 'font-english'}`}>
              <span className="text-sm font-semibold text-blue-700">
                {language === 'ur' 
                  ? `صفحہ ${pagination.currentPage} از ${pagination.totalPages}` 
                  : `Page ${pagination.currentPage} of ${pagination.totalPages}`
                }
              </span>
              <span className="text-xs text-blue-600">
                ({pagination.total} {language === 'ur' ? 'کل آئٹمز' : 'total items'})
              </span>
            </div>
            
            <button
              onClick={() => fetchNews(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm ${language === 'ur' ? 'font-urdu' : 'font-english'}`}
            >
              <span className="font-medium">{language === 'ur' ? 'اگلا' : 'Next'}</span>
              <FiChevronRight className={language === 'ur' ? 'rotate-180' : ''} />
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