import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, User, Mail, Youtube, Instagram, Twitter, Facebook, TrendingUp, Settings } from 'lucide-react';
import useAuthStore from '../stores/authStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get auth store data
  const { user, isAuthenticated, logout } = useAuthStore();

  // Check if user can access admin panel
  const canAccessAdmin = user && ['admin', 'editor', 'author'].includes(user.role);

  const handleLogout = async () => {
    await logout();
  };

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
                <TrendingUp className="w-10 h-10 text-indigo-600 ml-2" />
                <div className="text-3xl font-bold text-indigo-700">ATP</div>
              </div>
              <div className="mr-3 text-gray-600">
                <div className="text-sm font-medium">آٹو ٹریڈنگ پلیٹ فارم</div>
              </div>
            </Link>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
              ٹریڈنگ
            </button>
            <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">مارکیٹ تجزیہ</a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">پورٹ فولیو</a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">تعلیم</a>
            
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
              <a href="#" className="block py-2 text-gray-700 hover:text-indigo-600">ٹریڈنگ</a>
              <a href="#" className="block py-2 text-gray-700 hover:text-indigo-600">مارکیٹ تجزیہ</a>
              <a href="#" className="block py-2 text-gray-700 hover:text-indigo-600">پورٹ فولیو</a>
              <a href="#" className="block py-2 text-gray-700 hover:text-indigo-600">تعلیم</a>
              
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