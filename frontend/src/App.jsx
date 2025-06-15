import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import NewsDetail from './components/NewsDetail';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import AdminNews from './components/AdminNews';
import AdminUsers from './components/AdminUsers';
import AdminCategories from './components/AdminCategories';

import AdminSettings from './components/AdminSettings';
import { LanguageProvider } from './context/LanguageContext';

// Main News Component
const NewsApp = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);

  const sampleNews = [
    {
      id: 1,
      title: 'ATP میں نئے ٹریڈنگ فیچرز کا اضافہ - خودکار تجارت میں انقلاب',
      excerpt: 'ATP پلیٹ فارم میں جدید ترین AI الگورتھم کے ساتھ نئے ٹریڈنگ ٹولز شامل کیے گئے ہیں۔ یہ فیچرز صارفین کو بہتر تجارتی فیصلے کرنے میں مدد کریں گے۔',
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'ٹیکنالوجی',
      source: 'ATP نیوز',
      time: 'PM 11:11 2025، 10 جون',
      views: '15.2K',
      comments: 45
    },
    {
      id: 2,
      title: 'کرپٹو کرنسی میں تیزی سے اضافہ - ATP صارفین کو نئے مواقع',
      excerpt: 'آج کے دن کرپٹو مارکیٹ میں نمایاں بہتری دیکھی گئی۔ ATP کے تجزیہ کاروں کے مطابق یہ بڑھوتری مستحکم ہے۔',
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'مالیات',
      source: 'ATP مالی ڈیسک',
      time: 'PM 9:47 2025، 10 جون',
      views: '12.8K',
      comments: 32
    },
    {
      id: 3,
      title: 'اسٹاک مارکیٹ کی کارکردگی - ATP کے تجزیے اور توقعات',
      excerpt: 'مقامی اور بین الاقوامی اسٹاک مارکیٹس میں مثبت رجحان۔ ATP کے ماہرین کی تفصیلی رپورٹ۔',
      image: 'https://images.pexels.com/photos/6801645/pexels-photo-6801645.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'اسٹاک مارکیٹ',
      source: 'ATP تجزیہ کار',
      time: 'PM 8:30 2025، 10 جون',
      views: '9.5K',
      comments: 28
    },
    {
      id: 4,
      title: 'آٹو ٹریڈنگ میں AI کا کردار - مستقبل کے تجارتی طریقے',
      excerpt: 'مصنوعی ذہانت کا استعمال کرتے ہوئے ATP کے نئے ٹریڈنگ بوٹس کی کارکردگی کا جائزہ۔',
      image: 'https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'AI ٹریڈنگ',
      source: 'ATP ٹیک ٹیم',
      time: 'PM 7:15 2025، 10 جون',
      views: '8.1K',
      comments: 19
    },
    {
      id: 5,
      title: 'مالی منصوبہ بندی میں ATP کے جدید ٹولز کا استعمال',
      excerpt: 'ذاتی مالیات کے بہتر انتظام کے لیے ATP کے نئے فیچرز اور ان کے فوائد۔',
      image: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'مالی منصوبہ بندی',
      source: 'ATP مشیر',
      time: 'PM 6:45 2025، 10 جون',
      views: '7.3K',
      comments: 15
    },
    {
      id: 6,
      title: 'نئے صارفین کے لیے ATP کی مکمل گائیڈ',
      excerpt: 'ATP پلیٹ فارم کا استعمال شروع کرنے کے لیے مکمل ہدایات اور بہترین طریقے۔',
      image: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'تعلیم',
      source: 'ATP گائیڈ',
      time: 'PM 5:30 2025، 10 جون',
      views: '6.8K',
      comments: 22
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setNews(sampleNews);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleNewsClick = (newsItem) => {
    setSelectedNews(newsItem);
  };

  const handleBackToList = () => {
    setSelectedNews(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">ATP لوڈ ہو رہا ہے...</p>
        </div>
      </div>
    );
  }

  // Show news detail page if a news item is selected
  if (selectedNews) {
    return (
      <div className="min-h-screen bg-gray-50 font-urdu">
        <Header />
        <NewsDetail news={selectedNews} onBack={handleBackToList} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-urdu">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Navigation Arrows */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2 space-x-reverse">
                <button className="w-8 h-8 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50">
                  ←
                </button>
                <button className="w-8 h-8 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50">
                  →
                </button>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2">
                اہم خبریں
              </h1>
            </div>

            {/* Featured News and Side News */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Left Side News */}
              <div className="space-y-4">
                {news.slice(1, 4).map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleNewsClick(item)}
                  >
                    <div className="flex">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-24 h-20 object-cover flex-shrink-0"
                      />
                      <div className="p-3 flex-1">
                        <h3 className="text-sm font-medium text-gray-800 leading-relaxed text-right mb-1">
                          {item.title.substring(0, 80)}...
                        </h3>
                        <div className="text-xs text-gray-500 text-right">
                          {item.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Featured News */}
              <div className="lg:col-span-2">
                <div onClick={() => handleNewsClick(news[0])} className="cursor-pointer">
                  <NewsCard news={news[0]} featured={true} />
                </div>
              </div>
            </div>

            {/* Latest News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.slice(1).map((item) => (
                <div key={item.id} onClick={() => handleNewsClick(item)} className="cursor-pointer">
                  <NewsCard news={item} />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <Sidebar onNewsClick={handleNewsClick} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/news" element={<AdminNews />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/categories" element={<AdminCategories />} />

          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/" element={<NewsApp />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;