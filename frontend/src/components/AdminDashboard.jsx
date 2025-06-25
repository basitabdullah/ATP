import AdminLayout from './AdminLayout';
import { useLanguage, translations } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { 
  HiNewspaper, 
  HiUsers, 
  HiEye, 
  HiPlus, 
  HiUserGroup, 
  HiHome,
  HiExclamationTriangle,
  HiDocumentText,
  HiClock
} from 'react-icons/hi2';

const AdminDashboard = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const [recentNews, setRecentNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsData, setStatsData] = useState({
    totalNews: '0',
    totalUsers: '0'
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const stats = [
    {
      title: t.totalNews,
      value: statsData.totalNews,
      icon: HiNewspaper,
      color: 'blue'
    },
    {
      title: t.totalUsers,
      value: statsData.totalUsers,
      icon: HiUsers,
      color: 'green'
    }
  ];

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      
      // Fetch news stats and users count in parallel
      const [newsStatsResponse, usersResponse] = await Promise.all([
        api.get('/news/admin/stats'),
        api.get('/users')
      ]);

      if (newsStatsResponse.data.success && usersResponse.data.success) {
        setStatsData({
          totalNews: newsStatsResponse.data.stats.totalNews.toLocaleString(),
          totalUsers: usersResponse.data.count.toLocaleString()
        });
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
      // Keep default values on error
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch recent published news
  const fetchRecentNews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/news', {
        params: {
          status: 'published',
          limit: 5,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        }
      });

      if (response.data.success) {
        setRecentNews(response.data.news);
      }
    } catch (err) {
      console.error('Error fetching recent news:', err);
      setError('Failed to load recent news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRecentNews();
  }, []);

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500 text-blue-100',
      green: 'bg-green-500 text-green-100',
      purple: 'bg-purple-500 text-purple-100',
      orange: 'bg-orange-500 text-orange-100'
    };
    return colors[color] || colors.blue;
  };

  return (
    <AdminLayout currentPage="dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">{t.welcome}</h1>
          <p className="text-blue-100">{t.todayDate}: {new Date().toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US')}</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  {statsLoading ? (
                    <div className="flex items-center">
                      <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent News */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">{t.recentNews}</h2>
              <button 
                onClick={() => navigate('/admin/news')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {t.viewAll}
              </button>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">{t.loading || 'Loading...'}</span>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <HiExclamationTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-red-600">{error}</p>
                </div>
              ) : recentNews.length === 0 ? (
                <div className="text-center py-8">
                  <HiDocumentText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">{t.noNewsFound || 'No published news found'}</p>
                </div>
              ) : (
                recentNews.map((news) => (
                  <div key={news._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-1">{news.title}</h3>
                      <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                        <span className="flex items-center">
                          <HiClock className="w-4 h-4 ml-1" />
                          {new Date(news.createdAt).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US')}
                        </span>
                        <span className="flex items-center">
                          <HiEye className="w-4 h-4 ml-1" />
                          {news.downloads || 0}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {t.published}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {news.category}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate('/admin/news')}
                      className="text-gray-400 hover:text-gray-600"
                      title="Go to News Management"
                    >
                      ⋯
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{t.quickActions}</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/')}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <HiHome className="w-4 h-4 ml-2" />
                  {language === 'ur' ? (
                    <>
                      <span>ہوم پیج دیکھیں</span>
                    </>
                  ) : (
                    <>
                      <span>Go to Home</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={() => navigate('/admin/news')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <HiPlus className="w-4 h-4 ml-2" />
                  {t.addNews}
                </button>
                <button 
                  onClick={() => navigate('/admin/users')}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <HiUserGroup className="w-4 h-4 ml-2" />
                  {t.manageUsers}
                </button>
              </div>
            </div>



            {/* System Status */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{t.systemStatus}</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">{t.server}</span>
                  <span className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                    {t.active}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">{t.database}</span>
                  <span className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                    {t.active}
                  </span>
                </div>
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 