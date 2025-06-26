import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import NewsDetail from './components/NewsDetail';
import CategoryPage from './components/CategoryPage';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import AdminNews from './components/AdminNews';
import AdminUsers from './components/AdminUsers';
import AdminCategories from './components/AdminCategories';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import AdminSettings from './components/AdminSettings';
import { LanguageProvider } from './context/LanguageContext';
import useAuthStore from './stores/authStore';
import { apiJSON } from './lib/axios';

// News Context Provider to share news data across components

const NewsContext = createContext();

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

// News Provider Component
const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch news from API
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch published news for public display
      const response = await apiJSON.get('/news/public', {
        params: {
          status: 'published',
          limit: 20,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        }
      });

      if (response.data.success) {
        // Transform API data to match the expected format
        const transformedNews = response.data.news.map(item => ({
          id: item._id,
          title: item.title,
          excerpt: item.excerpt,
          content: item.content,
          image: item.image ? `${import.meta.env.VITE_BACKEND_URl}/uploads/${item.image}` : 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
          category: item.category,
          source: item.authorName || 'ATP نیوز',
          time: new Date(item.createdAt).toLocaleDateString('ur-PK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          views: item.views || 0,
          comments: 0, // Comments not implemented yet
          description: item.description,
          tags: item.tags || []
        }));

        setNews(transformedNews);
      } else {
        setError('Failed to fetch news');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('خبریں لوڈ کرنے میں خرابی ہوئی');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <NewsContext.Provider value={{ news, loading, error, fetchNews }}>
      {children}
    </NewsContext.Provider>
  );
};

// News Detail Page Component
const NewsDetailPage = () => {
  const { newsId } = useParams();
  const { news } = useNews();
  const navigate = useNavigate();
  
  const selectedNews = news.find(item => item.id === newsId);
  
  const handleBack = () => {
    navigate('/');
  };
  
  if (!selectedNews) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg mb-4">خبر نہیں ملی</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            واپس جائیں
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 font-urdu">
      <Header news={news} />
      <NewsDetail news={selectedNews} onBack={handleBack} allNews={news} />
      <Footer />
    </div>
  );
};

// Category Page Component
const CategoryPageRoute = () => {
  const { categoryName } = useParams();
  const { news } = useNews();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleNewsClick = (newsItem) => {
    navigate(`/news/${newsItem.id}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 font-urdu">
      <Header news={news} />
      <CategoryPage 
        category={categoryName} 
        news={news} 
        onNewsClick={handleNewsClick} 
        onBack={handleBack} 
      />
      <Footer />
    </div>
  );
};

// Main News Component
const NewsApp = () => {
  const { news, loading, error, fetchNews } = useNews();
  const navigate = useNavigate();

  // Initialize auth state
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth state when app loads
    initializeAuth();
  }, [initializeAuth]);

  const handleNewsClick = (newsItem) => {
    navigate(`/news/${newsItem.id}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button 
            onClick={fetchNews}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            دوبارہ کوشش کریں
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-urdu">
      <Header onCategoryClick={handleCategoryClick} news={news} />
      
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

            {/* Important News Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Left Side Important News */}
              <div className="space-y-4">
                {news.filter(item => item.category === 'important').slice(0, 3).map((item) => (
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
                          {item.title.length > 80 ? item.title.substring(0, 80) + '...' : item.title}
                        </h3>
                        <div className="text-xs text-gray-500 text-right">
                          {item.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {news.filter(item => item.category === 'important').length === 0 && (
                  <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                    <div className="text-gray-400 text-4xl mb-2">🚨</div>
                    <p className="text-gray-600">ابھی کوئی اہم خبر دستیاب نہیں</p>
                  </div>
                )}
              </div>

              {/* Featured News */}
              <div className="lg:col-span-2">
                {news.filter(item => item.category === 'important').length > 0 ? (
                  <div onClick={() => handleNewsClick(news.filter(item => item.category === 'important')[0])} className="cursor-pointer">
                    <NewsCard news={news.filter(item => item.category === 'important')[0]} featured={true} />
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <div className="text-gray-400 text-6xl mb-4">📰</div>
                    <p className="text-gray-600">ابھی کوئی اہم خبر دستیاب نہیں</p>
                  </div>
                )}
              </div>
            </div>

            {/* Latest News Articles Grid */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-green-600 pb-2 mb-6 text-right">
                تازہ خبریں
              </h2>
              {news.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📰</div>
                  <p className="text-gray-600 text-lg mb-4">ابھی کوئی خبر دستیاب نہیں</p>
                  <button 
                    onClick={fetchNews}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    دوبارہ لوڈ کریں
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.map((item) => (
                    <div key={item.id} onClick={() => handleNewsClick(item)} className="cursor-pointer">
                      <NewsCard news={item} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <Sidebar onNewsClick={handleNewsClick} news={news} />
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
        <NewsProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/news" element={<AdminNews />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/news/:newsId" element={<NewsDetailPage />} />
            <Route path="/category/:categoryName" element={<CategoryPageRoute />} />
            <Route path="/" element={<NewsApp />} />
          </Routes>
        </NewsProvider>
      </Router>
    </LanguageProvider>
  );
}

export default App;