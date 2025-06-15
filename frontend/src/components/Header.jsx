import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, User, Mail, Youtube, Instagram, Twitter, Facebook, TrendingUp } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
          </div>

          {/* Auth Buttons */}
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
              <div className="pt-2 border-t mt-2">
                <Link to="/login" className="block py-2 text-indigo-600 font-medium">لاگ ان</Link>
                <Link to="/register" className="block py-2 text-emerald-600 font-medium">رجسٹر</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;