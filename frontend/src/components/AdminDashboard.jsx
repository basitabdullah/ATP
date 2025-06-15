import AdminLayout from './AdminLayout';
import { useLanguage, translations } from '../context/LanguageContext';

const AdminDashboard = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const stats = [
    {
      title: t.totalNews,
      value: '156',
      change: '+12%',
      changeType: 'increase',
      icon: '📰',
      color: 'blue'
    },
    {
      title: t.totalUsers,
      value: '2,348',
      change: '+8%',
      changeType: 'increase',
      icon: '👥',
      color: 'green'
    },
    {
      title: t.todayViews,
      value: '45.2K',
      change: '+23%',
      changeType: 'increase',
      icon: '👁️',
      color: 'purple'
    },
    {
      title: t.totalComments,
      value: '892',
      change: '-5%',
      changeType: 'decrease',
      icon: '💬',
      color: 'orange'
    }
  ];

  const recentNews = [
    {
      id: 1,
      title: 'ATP میں نئے ٹریڈنگ فیچرز کا اضافہ',
      status: 'published',
      views: '15.2K',
      date: '2025، 10 جون'
    },
    {
      id: 2,
      title: 'کرپٹو کرنسی میں تیزی سے اضافہ',
      status: 'published',
      views: '12.8K',
      date: '2025، 10 جون'
    },
    {
      id: 3,
      title: 'اسٹاک مارکیٹ کی کارکردگی',
      status: 'draft',
      views: '0',
      date: '2025، 10 جون'
    }
  ];

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
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === 'increase'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className={`text-sm text-gray-500 ${language === 'ur' ? 'mr-2' : 'ml-2'}`}>
                      {t.fromLastMonth}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
                  <span className="text-xl">{stat.icon}</span>
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
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                {t.viewAll}
              </button>
            </div>
            <div className="space-y-4">
              {recentNews.map((news) => (
                <div key={news.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-1">{news.title}</h3>
                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                      <span>{news.date}</span>
                      <span>👁️ {news.views}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          news.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {news.status === 'published' ? t.published : t.draft}
                      </span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    ⋯
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{t.quickActions}</h2>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  {t.addNews}
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  {t.addCategory}
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  {t.manageUsers}
                </button>
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{t.popularCategories}</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">{t.technology}</span>
                  <span className="text-blue-600 font-medium">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">{t.finance}</span>
                  <span className="text-blue-600 font-medium">32</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">{t.stockMarket}</span>
                  <span className="text-blue-600 font-medium">28</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">{t.aiTrading}</span>
                  <span className="text-blue-600 font-medium">19</span>
                </div>
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
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">{t.backup}</span>
                  <span className="flex items-center text-yellow-600">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full ml-2"></div>
                    {t.inProgress}
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