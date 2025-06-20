import { useState } from 'react';
import NewsCard from './NewsCard';

const CategoryPage = ({ category, news, onNewsClick, onBack }) => {
  const [sortBy, setSortBy] = useState('newest');
  
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

  // Get category display name
  const getCategoryLabel = (cat) => {
    const labels = {
      technology: 'ٹیکنالوجی',
      business: 'کاروبار', 
      sports: 'کھیل',
      entertainment: 'تفریح',
      health: 'صحت',
      politics: 'سیاست',
      science: 'سائنس',
      important: 'اہم خبریں',
      'market-updates': 'مارکیٹ اپڈیٹس',
      other: 'دیگر'
    };
    return labels[cat] || cat;
  };

  const getCategoryColor = (cat) => {
    const colors = {
      technology: 'bg-blue-500',
      business: 'bg-green-500',
      sports: 'bg-red-500',
      entertainment: 'bg-purple-500',
      health: 'bg-emerald-500',
      politics: 'bg-orange-500',
      science: 'bg-cyan-500',
      important: 'bg-rose-500',
      'market-updates': 'bg-teal-500',
      other: 'bg-gray-500'
    };
    return colors[cat] || 'bg-gray-500';
  };

  const getCategoryDescription = (cat) => {
    const descriptions = {
      technology: 'جدید ترین ٹیکنالوجی اور ڈیجیٹل انقلاب کی خبریں',
      business: 'کاروباری دنیا، اقتصادی تجزیے اور مالی خبریں',
      sports: 'کھیلوں کی دنیا کی تازہ ترین خبریں اور تجزیے',
      entertainment: 'تفریحی دنیا کی رنگا رنگ خبریں',
      health: 'صحت اور طبی معلومات کی مفید خبریں',
      politics: 'سیاسی واقعات اور ملکی و بین الاقوامی سیاست',
      science: 'سائنسی دریافتوں اور تحقیق کی خبریں',
      important: 'فوری اور اہم ترین خبریں',
      'market-updates': 'مارکیٹ اور تجارتی اپڈیٹس',
      other: 'مختلف موضوعات کی خبریں'
    };
    return descriptions[cat] || '';
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

        {/* Filters and Sort */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-gray-700 font-medium">ترتیب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              >
                <option value="newest">تازہ ترین</option>
                <option value="oldest">پرانی ترین</option>
                <option value="views">زیادہ دیکھی گئی</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {sortedNews.length} خبریں نظر آ رہی ہیں
            </div>
          </div>
        </div>

        {/* News Grid */}
        {sortedNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedNews.map((newsItem) => (
              <div
                key={newsItem.id}
                onClick={() => onNewsClick && onNewsClick(newsItem)}
                className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
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