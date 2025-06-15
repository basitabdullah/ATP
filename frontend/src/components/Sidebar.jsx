const Sidebar = ({ onNewsClick, news = [] }) => {
  const categories = [
    { name: 'technology', label: 'ٹیکنالوجی', count: news.filter(n => n.category === 'technology').length },
    { name: 'business', label: 'کاروبار', count: news.filter(n => n.category === 'business').length },
    { name: 'sports', label: 'کھیل', count: news.filter(n => n.category === 'sports').length },
    { name: 'entertainment', label: 'تفریح', count: news.filter(n => n.category === 'entertainment').length },
    { name: 'health', label: 'صحت', count: news.filter(n => n.category === 'health').length },
    { name: 'politics', label: 'سیاست', count: news.filter(n => n.category === 'politics').length },
    { name: 'science', label: 'سائنس', count: news.filter(n => n.category === 'science').length },
    { name: 'other', label: 'دیگر', count: news.filter(n => n.category === 'other').length }
  ];

  // Static market updates data
  const staticMarketUpdates = [
    {
      id: 'market-1',
      title: 'بٹ کوائن میں 5% اضافہ - ATP کے صارفین کو بہترین منافع',
      excerpt: 'کرپٹو مارکیٹ میں مثبت رجحان اور ATP کے آٹو ٹریڈنگ بوٹس کی کارکردگی۔',
      time: '10 جون، 11:13 PM',
      category: 'کرپٹو',
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=100',
      source: 'ATP مارکیٹ',
      views: '8.5K',
      comments: 23
    },
    {
      id: 'market-2',
      title: 'گولڈ کی قیمتوں میں اتار چڑھاؤ - ٹریڈنگ کے بہترین مواقع',
      excerpt: 'سونے کی قیمتوں میں تبدیلی اور ATP کے تجزیہ کاروں کی رائے۔',
      time: '10 جون، 11:12 PM',
      category: 'کموڈٹی',
      image: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=100',
      source: 'ATP تجزیات',
      views: '7.2K',
      comments: 18
    },
    {
      id: 'market-3',
      title: 'فارکس مارکیٹ میں EUR/USD کی کارکردگی',
      excerpt: 'یورو ڈالر کی جوڑی میں حالیہ تبدیلیاں اور تجارتی مواقع۔',
      time: '10 جون، 11:10 PM',
      category: 'فارکس',
      image: 'https://images.pexels.com/photos/6801645/pexels-photo-6801645.jpeg?auto=compress&cs=tinysrgb&w=100',
      source: 'ATP فارکس',
      views: '6.8K',
      comments: 15
    }
  ];

  const acceptedNews = [
    {
      title: 'نئے AI ٹریڈنگ الگورتھم کا تجربہ',
      time: '2 گھنٹے پہلے'
    },
    {
      title: 'مارکیٹ کی رپورٹ اور آئندہ ہفتے کی توقعات',
      time: '3 گھنٹے پہلے'
    },
    {
      title: 'کامیاب ٹریڈرز کے انٹرویوز اور تجاویز',
      time: '4 گھنٹے پہلے'
    }
  ];

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
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-1 rounded">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
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
          {staticMarketUpdates.map((newsItem) => (
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
        </div>
      </div>

      {/* Trading Insights Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 text-right border-b border-indigo-600 pb-2">
          ٹریڈنگ بصیرت
        </h2>
        <div className="space-y-3">
          {acceptedNews.map((news, index) => (
            <div key={index} className="border-b border-gray-100 pb-2 last:border-b-0">
              <h3 className="text-sm text-gray-700 text-right mb-1">{news.title}</h3>
              <div className="text-xs text-gray-500 text-right">{news.time}</div>
            </div>
          ))}
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