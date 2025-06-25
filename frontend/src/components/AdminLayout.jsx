import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, translations } from '../context/LanguageContext';
import useAuthStore from '../stores/authStore';

const AdminLayout = ({ children, currentPage = 'dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];
  const { user } = useAuthStore();

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: '📊', path: '/admin' },
    { id: 'news', label: t.newsManagement, icon: '📰', path: '/admin/news' },
    // { id: 'categories', label: t.categories, icon: '📂', path: '/admin/categories' },
    { id: 'users', label: t.users, icon: '👥', path: '/admin/users' },

    // { id: 'settings', label: t.settings, icon: '⚙️', path: '/admin/settings' },
  ];

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  return (
    <div className={`flex h-screen bg-gray-100 ${language === 'ur' ? 'font-urdu' : ''}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className={`flex items-center ${!sidebarOpen && 'justify-center'}`}>
            <button 
              onClick={() => navigate('/')}
              className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold hover:bg-blue-700 transition-colors cursor-pointer"
              title="Go to Home"
            >
              ATP
            </button>
            {sidebarOpen && (
              <span className={`${language === 'ur' ? 'mr-3' : 'ml-3'} text-xl font-bold text-gray-800`}>
                {t.adminPanel}
              </span>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              {language === 'ur' ? '←' : '→'}
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 mt-4">
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

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 p-4">
          {/* Collapse Button for collapsed state */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mb-2"
            >
              <span className="text-xl">{language === 'ur' ? '→' : '←'}</span>
            </button>
          )}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`flex items-center text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
              sidebarOpen ? 'w-full px-4 py-3' : 'w-full justify-center p-2'
            }`}
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
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className={`${language === 'ur' ? 'mr-2' : 'ml-2'} text-sm font-medium text-gray-700`}>
                  {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : t.admin}
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