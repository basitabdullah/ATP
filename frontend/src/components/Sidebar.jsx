import { useState, useEffect } from 'react';
import { apiJSON } from '../lib/axios';

const Sidebar = ({ onNewsClick, news = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

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

  // Filter news based on search term
  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search
  const handleSearch = () => {
    if (searchTerm.trim() && filteredNews.length > 0) {
      // Click on the first search result
      onNewsClick && onNewsClick(filteredNews[0]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <aside className="space-y-6">
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 text-right border-b border-indigo-600 pb-2">
          تلاش کریں
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="خبریں تلاش کریں..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-right placeholder-gray-400"
          />
          <button 
            onClick={handleSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        {searchTerm && (
          <div className="mt-2 text-sm text-gray-600 text-right">
            {filteredNews.length} نتائج ملے
          </div>
        )}
      </div>

      {/* Trading Categories Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 text-right border-b border-indigo-600 pb-2">
          ٹریڈنگ کیٹگریز
        </h2>
        <div className="space-y-2">
          {categoriesLoading ? (
            <p className="text-gray-500 text-sm text-center py-4">لوڈ ہو رہا ہے...</p>
          ) : categories.filter(cat => cat.count > 0).length > 0 ? (
            categories.filter(cat => cat.count > 0).map((category) => (
              <div key={category.name} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded px-2 transition-colors">
                <span className="text-gray-500 text-sm">({category.count})</span>
                <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                  {category.label}
                </a>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">کوئی کیٹگری دستیاب نہیں</p>
          )}
        </div>
      </div>

      {/* Market Updates Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 text-right border-b border-indigo-600 pb-2">
          مارکیٹ اپڈیٹس
        </h2>
        <div className="space-y-4">
          {news.filter(item => item.category && item.category.toLowerCase().includes('market')).slice(0, 3).map((newsItem) => (
            <div 
              key={newsItem.id} 
              className="flex items-start space-x-3 space-x-reverse cursor-pointer hover:bg-gray-50 rounded p-2 transition-colors"
              onClick={() => onNewsClick && onNewsClick(newsItem)}
            >
              <img
                src={newsItem.image}
                alt={newsItem.title}
                className="w-16 h-16 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-800 leading-relaxed text-right mb-1">
                  {newsItem.title.length > 60 ? newsItem.title.substring(0, 60) + '...' : newsItem.title}
                </h3>
                <div className="text-xs text-gray-500 text-right">
                  <span className="text-emerald-600">{newsItem.category}</span>
                  <span className="mx-2">•</span>
                  <span>{newsItem.time}</span>
                </div>
              </div>
            </div>
          ))}
          {news.filter(item => item.category && item.category.toLowerCase().includes('market')).length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">کوئی مارکیٹ اپڈیٹ دستیاب نہیں</p>
          )}
        </div>
      </div>

      {/* Trading Insights Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 text-right border-b border-indigo-600 pb-2">
          ٹریڈنگ بصیرت
        </h2>
        <div className="space-y-3">
          {news.filter(item => item.category && item.category.toLowerCase().includes('important')).slice(0, 3).map((newsItem, index) => (
            <div key={index} className="border-b border-gray-100 pb-2 last:border-b-0">
              <h3 className="text-sm text-gray-700 text-right mb-1">{newsItem.title}</h3>
              <div className="text-xs text-gray-500 text-right">{newsItem.time}</div>
            </div>
          ))}
          {news.filter(item => item.category && item.category.toLowerCase().includes('important')).length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">کوئی ٹریڈنگ بصیرت دستیاب نہیں</p>
          )}
        </div>
      </div>


    </aside>
  );
};

export default Sidebar;