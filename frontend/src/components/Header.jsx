import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, Mail, Youtube, Instagram, Twitter, Facebook, TrendingUp, Settings } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import { apiJSON } from '../lib/axios';

const Header = ({ news = [] }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Get auth store data
  const { user, isAuthenticated, logout } = useAuthStore();

  // Check if user can access admin panel
  const canAccessAdmin = user && ['admin', 'editor', 'author'].includes(user.role);

  const handleLogout = async () => {
    await logout();
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await apiJSON.get('/categories');
        const fetchedCategories = response.data.categories || [];
        
        // Transform categories and add counts
        const categoriesWithCounts = fetchedCategories.map(cat => ({
          name: cat.name.toLowerCase(),
          label: cat.name,
          count: news.filter(n => n.category && n.category.toLowerCase() === cat.name.toLowerCase()).length
        }));
        
        setCategories(categoriesWithCounts);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [news]); // Re-fetch when news changes to update counts

  // Get top 4 categories with most news
  const topCategories = categories
    .filter(cat => cat.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return (
    <header className="bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-indigo-800 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-yellow-300">رابطہ</span>
              <div className="flex space-x-2 space-x-reverse">
                <Mail className="w-4 h-4" />
                <Youtube className="w-4 h-4" />
                <Instagram className="w-4 h-4" />
                <Twitter className="w-4 h-4" />
                <Facebook className="w-4 h-4" />
              </div>
            </div>
            <div className="text-yellow-300">
              آخری اپ ڈیٹ: 10 جون، PM 11:23 2025
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex items-center">
                <img 
                  src="/logo.jpg" 
                  alt="ATP Logo" 
                  className="h-12 w-auto object-contain mr-3 rounded-full"
                />
              </div>
              <div className="mr-3 text-gray-600">
                <div className="text-sm font-medium">آرکینم ٹائیڈ پریس</div>
              </div>
            </Link>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-6 space-x-reverse">
            {topCategories.map((category, index) => (
              <button
                key={category.name}
                onClick={() => navigate(`/category/${category.name}`)}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  index === 0 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                {category.label}
                <span className="ml-1 text-xs opacity-75">({category.count})</span>
              </button>
            ))}
            
            {/* Admin Dashboard Button - Only show for admin, editor, author */}
            {canAccessAdmin && (
              <Link 
                to="/admin"
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors flex items-center"
              >
                <Settings className="w-4 h-4 ml-2" />
                ایڈمن پینل
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-2 space-x-reverse">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3 space-x-reverse">
                {/* User Info */}
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">
                    {user.fullName || `${user.firstName} ${user.lastName}`}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user.role === 'standard-user' ? 'صارف' : 
                     user.role === 'premium-user' ? 'پریمیم صارف' :
                     user.role === 'author' ? 'مصنف' :
                     user.role === 'editor' ? 'ایڈیٹر' :
                     user.role === 'admin' ? 'ایڈمن' : user.role}
                  </div>
                </div>
                
                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm"
                >
                  لاگ آؤٹ
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 space-x-reverse">
                <Link 
                  to="/register"
                  className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors text-sm"
                >
                  رجسٹر
                </Link>
                <Link 
                  to="/login"
                  className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center hover:bg-indigo-700 transition-colors"
                >
                  <User className="w-4 h-4 ml-2" />
                  لاگ ان
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-indigo-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-50 border-t">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-2">
              {topCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => {
                    navigate(`/category/${category.name}`);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-between w-full py-2 text-gray-700 hover:text-indigo-600 text-right"
                >
                  <span className="text-xs text-gray-500">({category.count})</span>
                  <span>{category.label}</span>
                </button>
              ))}
              
              {/* Mobile Admin Dashboard Button */}
              {canAccessAdmin && (
                <Link to="/admin" className="block py-2 text-purple-600 font-medium">
                  ایڈمن پینل
                </Link>
              )}
              
              <div className="pt-2 border-t mt-2">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <div className="py-2 text-gray-800 font-medium">
                      {user.fullName || `${user.firstName} ${user.lastName}`}
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="block py-2 text-red-600 font-medium"
                    >
                      لاگ آؤٹ
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" className="block py-2 text-indigo-600 font-medium">لاگ ان</Link>
                    <Link to="/register" className="block py-2 text-emerald-600 font-medium">رجسٹر</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;