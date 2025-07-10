import { useState, useEffect } from 'react';
import NewsCard from './NewsCard';
import { apiJSON } from '../lib/axios';

const CategoryPage = ({ category, news, onNewsClick, onBack }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState([]);
  
  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiJSON.get('/categories');
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);
  
  // Filter news by category
  const categoryNews = news.filter(item => item.category === category);
  
  // Sort news based on selection
  const sortedNews = [...categoryNews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.time) - new Date(a.time);
      case 'oldest':
        return new Date(a.time) - new Date(b.time);
      case 'views':
        return (b.views || 0) - (a.views || 0);
      default:
        return 0;
    }
  });

  // Get category display name - use API data or fallback to category name
  const getCategoryLabel = (cat) => {
    const categoryData = categories.find(c => c.name.toLowerCase() === cat.toLowerCase());
    return categoryData ? categoryData.name : cat;
  };

  // Dynamic color generation based on category name
  const getCategoryColor = (cat) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-purple-500', 'bg-emerald-500', 'bg-orange-500', 'bg-cyan-500', 'bg-rose-500', 'bg-teal-500', 'bg-gray-500'];
    const index = cat.length % colors.length;
    return colors[index];
  };

  // Get category description from API or use generic description
  const getCategoryDescription = (cat) => {
    const categoryData = categories.find(c => c.name.toLowerCase() === cat.toLowerCase());
    return categoryData?.description || `${getCategoryLabel(cat)} کی تازہ ترین خبریں اور اپڈیٹس`;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-urdu">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span className="ml-2">←</span>
          واپس مین پیج پر
        </button>

        {/* Category Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className={`w-6 h-6 rounded-full ${getCategoryColor(category)} ml-3`}></div>
              <h1 className="text-4xl font-bold text-gray-800 leading-relaxed">
                {getCategoryLabel(category)}
              </h1>
            </div>
            <p className="text-gray-600 text-lg mb-4 leading-relaxed">
              {getCategoryDescription(category)}
            </p>
            <div className="text-sm text-gray-500">
              کل {categoryNews.length} خبریں دستیاب ہیں
            </div>
          </div>
        </div>



        {/* News Grid */}
        {sortedNews.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {sortedNews.map((newsItem) => (
              <div
                key={newsItem.id}
                onClick={(e) => {
                  e.preventDefault();
                  console.log('News clicked:', newsItem.title);
                  if (onNewsClick) {
                    onNewsClick(newsItem);
                  }
                }}
                className="cursor-pointer"
              >
                <NewsCard news={newsItem} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📰</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              اس کیٹگری میں کوئی خبر نہیں ملی
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              {getCategoryLabel(category)} کیٹگری میں ابھی کوئی خبر دستیاب نہیں ہے۔ برائے کرم بعد میں دوبارہ چیک کریں۔
            </p>
            <button
              onClick={onBack}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              واپس جائیں
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage; 