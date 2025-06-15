import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, translations } from '../context/LanguageContext';

const AdminLayout = ({ children, currentPage = 'dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: '📊', path: '/admin' },
    { id: 'news', label: t.newsManagement, icon: '📰', path: '/admin/news' },
    { id: 'categories', label: t.categories, icon: '📂', path: '/admin/categories' },
    { id: 'users', label: t.users, icon: '👥', path: '/admin/users' },

    { id: 'settings', label: t.settings, icon: '⚙️', path: '/admin/settings' },
  ];

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  return (
    <div className={`flex h-screen bg-gray-100 ${language === 'ur' ? 'font-urdu' : ''}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className={`flex items-center ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              ATP
            </div>
            {sidebarOpen && (
              <span className={`${language === 'ur' ? 'mr-3' : 'ml-3'} text-xl font-bold text-gray-800`}>
                {t.adminPanel}
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? (language === 'ur' ? '←' : '→') : (language === 'ur' ? '→' : '←')}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center px-4 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} hover:bg-gray-50 transition-colors ${
                currentPage === item.id ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-600' : 'text-gray-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && (
                <span className={`${language === 'ur' ? 'mr-3' : 'ml-3'} font-medium`}>{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span className="text-xl">🚪</span>
            {sidebarOpen && (
              <span className={`${language === 'ur' ? 'mr-3' : 'ml-3'} font-medium`}>{t.logout}</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              {menuItems.find(item => item.id === currentPage)?.label || t.adminPanel}
            </h1>
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {language === 'ur' ? 'English' : 'اردو'}
              </button>
              <div className="relative">
                <button className="p-2 text-gray-600 hover:text-gray-800 relative">
                  🔔
                  <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  A
                </div>
                <span className={`${language === 'ur' ? 'mr-2' : 'ml-2'} text-sm font-medium text-gray-700`}>
                  {t.admin}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 