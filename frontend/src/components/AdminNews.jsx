import { useState } from 'react';
import AdminLayout from './AdminLayout';
import { useLanguage, translations } from '../context/LanguageContext';

const AdminNews = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const [newArticle, setNewArticle] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    image: '',
    status: 'draft'
  });

  const [newsList, setNewsList] = useState([
    {
      id: 1,
      title: 'ATP میں نئے ٹریڈنگ فیچرز کا اضافہ - خودکار تجارت میں انقلاب',
      excerpt: 'ATP پلیٹ فارم میں جدید ترین AI الگورتھم کے ساتھ نئے ٹریڈنگ ٹولز شامل کیے گئے ہیں۔',
      category: 'ٹیکنالوجی',
      status: 'published',
      views: '15.2K',
      comments: 45,
      date: '2025، 10 جون',
      author: 'ATP نیوز'
    },
    {
      id: 2,
      title: 'کرپٹو کرنسی میں تیزی سے اضافہ - ATP صارفین کو نئے مواقع',
      excerpt: 'آج کے دن کرپٹو مارکیٹ میں نمایاں بہتری دیکھی گئی۔',
      category: 'مالیات',
      status: 'published',
      views: '12.8K',
      comments: 32,
      date: '2025، 10 جون',
      author: 'ATP مالی ڈیسک'
    },
    {
      id: 3,
      title: 'اسٹاک مارکیٹ کی کارکردگی - ATP کے تجزیے اور توقعات',
      excerpt: 'مقامی اور بین الاقوامی اسٹاک مارکیٹس میں مثبت رجحان۔',
      category: 'اسٹاک مارکیٹ',
      status: 'draft',
      views: '0',
      comments: 0,
      date: '2025، 10 جون',
      author: 'ATP تجزیہ کار'
    }
  ]);

  const categories = ['ٹیکنالوجی', 'مالیات', 'اسٹاک مارکیٹ', 'AI ٹریڈنگ', 'مالی منصوبہ بندی', 'تعلیم'];

  const handleAddArticle = (e) => {
    e.preventDefault();
    const newId = Math.max(...newsList.map(n => n.id)) + 1;
    const article = {
      ...newArticle,
      id: newId,
      views: '0',
      comments: 0,
      date: new Date().toLocaleDateString('ur-PK'),
      author: 'ایڈمن'
    };
    setNewsList([article, ...newsList]);
    setNewArticle({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      image: '',
      status: 'draft'
    });
    setShowAddForm(false);
  };

  const handleDeleteNews = (id) => {
    if (confirm(language === 'ur' ? 'کیا آپ واقعی اس خبر کو حذف کرنا چاہتے ہیں؟' : 'Do you really want to delete this news?')) {
      setNewsList(newsList.filter(news => news.id !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setNewsList(newsList.map(news => 
      news.id === id ? { ...news, status: newStatus } : news
    ));
  };

  const filteredNews = newsList.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.category.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || news.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || news.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <AdminLayout currentPage="news">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t.newsManagement}</h1>
            <p className="text-gray-600">{t.newsManagementDesc}</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t.addNewsButton}
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.search}</label>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.status}</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{t.all}</option>
                <option value="published">{t.published}</option>
                <option value="draft">{t.draft}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.category}</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{t.allCategories}</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* News Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {t.title}
                  </th>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {t.category}
                  </th>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {t.status}
                  </th>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {t.views}
                  </th>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {t.date}
                  </th>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNews.map((news) => (
                  <tr key={news.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{news.title}</div>
                        <div className="text-sm text-gray-500">{news.excerpt.substring(0, 100)}...</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {news.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={news.status}
                        onChange={(e) => handleStatusChange(news.id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-2 py-1 ${
                          news.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <option value="draft">{t.draft}</option>
                        <option value="published">{t.published}</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {news.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {news.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 space-x-reverse">
                        <button className="text-blue-600 hover:text-blue-900">
                          {t.edit}
                        </button>
                        <button 
                          onClick={() => handleDeleteNews(news.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          {t.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add News Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{t.addNewsButton}</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddArticle} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.title}</label>
                  <input
                    type="text"
                    required
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.category}</label>
                  <select
                    required
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">{language === 'ur' ? 'کیٹگری منتخب کریں' : 'Select Category'}</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{language === 'ur' ? 'خلاصہ' : 'Excerpt'}</label>
                  <textarea
                    required
                    rows="3"
                    value={newArticle.excerpt}
                    onChange={(e) => setNewArticle({...newArticle, excerpt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{language === 'ur' ? 'مواد' : 'Content'}</label>
                  <textarea
                    required
                    rows="8"
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{language === 'ur' ? 'تصویر URL' : 'Image URL'}</label>
                  <input
                    type="url"
                    value={newArticle.image}
                    onChange={(e) => setNewArticle({...newArticle, image: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.status}</label>
                  <select
                    value={newArticle.status}
                    onChange={(e) => setNewArticle({...newArticle, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">{t.draft}</option>
                    <option value="published">{t.published}</option>
                  </select>
                </div>

                <div className="flex space-x-4 space-x-reverse pt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t.save}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {t.cancel}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminNews; 