import { useState } from 'react';

const Sidebar = ({ onNewsClick, news = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = [
    { name: 'technology', label: 'ٹیکنالوجی', count: news.filter(n => n.category === 'technology').length },
    { name: 'business', label: 'کاروبار', count: news.filter(n => n.category === 'business').length },
    { name: 'sports', label: 'کھیل', count: news.filter(n => n.category === 'sports').length },
    { name: 'entertainment', label: 'تفریح', count: news.filter(n => n.category === 'entertainment').length },
    { name: 'health', label: 'صحت', count: news.filter(n => n.category === 'health').length },
    { name: 'politics', label: 'سیاست', count: news.filter(n => n.category === 'politics').length },
    { name: 'science', label: 'سائنس', count: news.filter(n => n.category === 'science').length },
    { name: 'important', label: 'اہم خبریں', count: news.filter(n => n.category === 'important').length },
    { name: 'market-updates', label: 'مارکیٹ اپڈیٹس', count: news.filter(n => n.category === 'market-updates').length },
    { name: 'other', label: 'دیگر', count: news.filter(n => n.category === 'other').length }
  ];

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
            placeholder="مارکیٹ اپڈیٹس تلاش کریں..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            onClick={handleSearch}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-1 rounded hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        
        {/* Search Results */}
        {searchTerm && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 text-right">
              نتائج ({filteredNews.length})
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {filteredNews.slice(0, 5).map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onNewsClick && onNewsClick(item)}
                  className="p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <h4 className="text-xs font-medium text-gray-800 text-right leading-relaxed">
                    {item.title.length > 50 ? item.title.substring(0, 50) + '...' : item.title}
                  </h4>
                  <p className="text-xs text-gray-500 text-right mt-1">
                    {item.category} • {item.time}
                  </p>
                </div>
              ))}
              {filteredNews.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-2">کوئی نتیجہ نہیں ملا</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Trading Categories Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 text-right border-b border-indigo-600 pb-2">
          ٹریڈنگ کیٹگریز
        </h2>
        <div className="space-y-2">
          {categories.filter(cat => cat.count > 0).map((category) => (
            <div key={category.name} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded px-2 transition-colors">
              <span className="text-gray-500 text-sm">({category.count})</span>
              <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                {category.label}
              </a>
            </div>
          ))}
          {categories.filter(cat => cat.count > 0).length === 0 && (
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
          {news.filter(item => item.category === 'market-updates').slice(0, 3).map((newsItem) => (
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
          {news.filter(item => item.category === 'market-updates').length === 0 && (
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
          {news.filter(item => item.category === 'important').slice(0, 3).map((newsItem, index) => (
            <div key={index} className="border-b border-gray-100 pb-2 last:border-b-0">
              <h3 className="text-sm text-gray-700 text-right mb-1">{newsItem.title}</h3>
              <div className="text-xs text-gray-500 text-right">{newsItem.time}</div>
            </div>
          ))}
          {news.filter(item => item.category === 'important').length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">کوئی ٹریڈنگ بصیرت دستیاب نہیں</p>
          )}
        </div>
      </div>

      {/* Quick Stats Widget */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow-sm border border-indigo-200 p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 text-right border-b border-indigo-600 pb-2">
          فوری اعداد و شمار
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-green-600 font-semibold">+2.5%</span>
            <span className="text-gray-700">BTC/USD</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-red-600 font-semibold">-1.2%</span>
            <span className="text-gray-700">ETH/USD</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-green-600 font-semibold">+0.8%</span>
            <span className="text-gray-700">EUR/USD</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;