import { useState } from 'react';
import AdminLayout from './AdminLayout';
import { useLanguage, translations } from '../context/LanguageContext';

const AdminCategories = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });

  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'ٹیکنالوجی',
      description: 'ٹیکنالوجی اور جدید ترین ایجادات کی خبریں',
      color: '#3B82F6',
      newsCount: 45,
      isActive: true,
      createdDate: '2025، 1 جون'
    },
    {
      id: 2,
      name: 'مالیات',
      description: 'مالی خبریں اور اقتصادی تجزیے',
      color: '#10B981',
      newsCount: 32,
      isActive: true,
      createdDate: '2025، 1 جون'
    },
    {
      id: 3,
      name: 'اسٹاک مارکیٹ',
      description: 'اسٹاک مارکیٹ کی تازہ ترین خبریں',
      color: '#F59E0B',
      newsCount: 28,
      isActive: true,
      createdDate: '2025، 1 جون'
    },
    {
      id: 4,
      name: 'AI ٹریڈنگ',
      description: 'مصنوعی ذہانت اور خودکار تجارت',
      color: '#8B5CF6',
      newsCount: 19,
      isActive: true,
      createdDate: '2025، 2 جون'
    },
    {
      id: 5,
      name: 'مالی منصوبہ بندی',
      description: 'ذاتی مالیات اور سرمایہ کاری',
      color: '#EF4444',
      newsCount: 15,
      isActive: false,
      createdDate: '2025، 3 جون'
    }
  ]);

  const handleAddCategory = (e) => {
    e.preventDefault();
    const newId = Math.max(...categories.map(c => c.id)) + 1;
    const category = {
      ...newCategory,
      id: newId,
      newsCount: 0,
      isActive: true,
      createdDate: new Date().toLocaleDateString('ur-PK')
    };
    setCategories([...categories, category]);
    setNewCategory({ name: '', description: '', color: '#3B82F6' });
    setShowAddForm(false);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description,
      color: category.color
    });
    setShowAddForm(true);
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    setCategories(categories.map(cat => 
      cat.id === editingCategory.id 
        ? { ...cat, ...newCategory }
        : cat
    ));
    setNewCategory({ name: '', description: '', color: '#3B82F6' });
    setEditingCategory(null);
    setShowAddForm(false);
  };

  const handleDeleteCategory = (id) => {
    const category = categories.find(c => c.id === id);
    if (category.newsCount > 0) {
      alert(language === 'ur' ? `اس کیٹگری میں ${category.newsCount} خبریں موجود ہیں۔ پہلے انہیں دوسری کیٹگری میں منتقل کریں۔` : `This category has ${category.newsCount} news. Please move them to another category first.`);
      return;
    }
    if (confirm(language === 'ur' ? 'کیا آپ واقعی اس کیٹگری کو حذف کرنا چاہتے ہیں؟' : 'Do you really want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  const colorOptions = [
    { value: '#3B82F6', name: t.blue },
    { value: '#10B981', name: t.green },
    { value: '#F59E0B', name: t.orange },
    { value: '#8B5CF6', name: t.purple },
    { value: '#EF4444', name: t.red },
    { value: '#6B7280', name: t.gray }
  ];

  return (
    <AdminLayout currentPage="categories">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t.categoryManagement}</h1>
            <p className="text-gray-600">{t.categoryManagementDesc}</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t.addCategoryButton}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-xl">📂</span>
              </div>
              <div className={language === 'ur' ? 'mr-4' : 'ml-4'}>
                <p className="text-sm font-medium text-gray-600">{t.totalCategories}</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <div className={language === 'ur' ? 'mr-4' : 'ml-4'}>
                <p className="text-sm font-medium text-gray-600">{t.activeCategories}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.filter(c => c.isActive).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-purple-600 text-xl">📰</span>
              </div>
              <div className={language === 'ur' ? 'mr-4' : 'ml-4'}>
                <p className="text-sm font-medium text-gray-600">{t.totalNews}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.reduce((sum, cat) => sum + cat.newsCount, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div 
                    className={`w-4 h-4 rounded-full ${language === 'ur' ? 'ml-3' : 'mr-3'}`}
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <h3 className="text-lg font-bold text-gray-800">{category.name}</h3>
                </div>
                <div className={`flex items-center ${language === 'ur' ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {t.edit}
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    {t.delete}
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{category.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{category.newsCount}</span> {language === 'ur' ? 'خبریں' : 'news'}
                </div>
                <div className={`flex items-center text-sm ${category.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${category.isActive ? 'bg-green-500' : 'bg-red-500'} ${language === 'ur' ? 'ml-2' : 'mr-2'}`}></div>
                  {category.isActive ? t.active : language === 'ur' ? 'غیر فعال' : 'Inactive'}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{t.createdDate}: {category.createdDate}</span>
                <button
                  onClick={() => handleToggleStatus(category.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {category.isActive ? (language === 'ur' ? 'غیر فعال کریں' : 'Deactivate') : (language === 'ur' ? 'فعال کریں' : 'Activate')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Category Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingCategory ? (language === 'ur' ? 'کیٹگری میں ترمیم' : 'Edit Category') : t.addCategoryButton}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingCategory(null);
                    setNewCategory({ name: '', description: '', color: '#3B82F6' });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.name}</label>
                  <input
                    type="text"
                    required
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={language === 'ur' ? 'کیٹگری کا نام' : 'Category name'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.description}</label>
                  <textarea
                    required
                    rows="3"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={language === 'ur' ? 'کیٹگری کی تفصیل' : 'Category description'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.color}</label>
                  <div className="flex space-x-2">
                    {colorOptions.map((colorOption) => (
                      <button
                        key={colorOption.value}
                        type="button"
                        onClick={() => setNewCategory({...newCategory, color: colorOption.value})}
                        className={`w-8 h-8 rounded-full border-2 ${
                          newCategory.color === colorOption.value ? 'border-gray-400' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: colorOption.value }}
                        title={colorOption.name}
                      />
                    ))}
                  </div>
                </div>

                <div className={`flex ${language === 'ur' ? 'space-x-4 space-x-reverse' : 'space-x-4'} pt-4`}>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingCategory ? (language === 'ur' ? 'اپ ڈیٹ کریں' : 'Update') : t.save}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingCategory(null);
                      setNewCategory({ name: '', description: '', color: '#3B82F6' });
                    }}
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

export default AdminCategories; 