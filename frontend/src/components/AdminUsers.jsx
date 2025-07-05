import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { useLanguage, translations } from '../context/LanguageContext';
import useUserStore from '../stores/userStore';

const AdminUsers = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const { users, isLoading, error, getAllUsers, updateUser, deleteUser } = useUserStore();

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUser(id, { role: newRole });
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm(language === 'ur' ? 'کیا آپ واقعی اس صارف کو حذف کرنا چاہتے ہیں؟' : 'Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`;
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'author': return 'bg-green-100 text-green-800';
      case 'premium-user': return 'bg-yellow-100 text-yellow-800';
      case 'standard-user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return t.admin;
      case 'editor': return t.editor;
      case 'author': return language === 'ur' ? 'مصنف' : 'Author';
      case 'premium-user': return language === 'ur' ? 'پریمیم صارف' : 'Premium User';
      case 'standard-user': return t.user;
      default: return role;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout currentPage="users">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">{language === 'ur' ? 'لوڈ ہو رہا ہے...' : 'Loading...'}</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout currentPage="users">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="users">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t.userManagement}</h1>
            <p className="text-gray-600">{t.userManagementDesc}</p>
          </div>
          <div>
            <Link 
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              {t.addUser}
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
              <div className={language === 'ur' ? 'mr-4' : 'ml-4'}>
                <p className="text-sm font-medium text-gray-600">{t.totalUsers}</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-purple-600 text-xl">👑</span>
              </div>
              <div className={language === 'ur' ? 'mr-4' : 'ml-4'}>
                <p className="text-sm font-medium text-gray-600">{t.admin}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-xl">✏️</span>
              </div>
              <div className={language === 'ur' ? 'mr-4' : 'ml-4'}>
                <p className="text-sm font-medium text-gray-600">{t.editors}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'editor').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 text-xl">📝</span>
              </div>
              <div className={language === 'ur' ? 'mr-4' : 'ml-4'}>
                <p className="text-sm font-medium text-gray-600">{language === 'ur' ? 'مصنف' : 'Authors'}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'author').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.search}</label>
              <input
                type="text"
                placeholder={t.searchUserPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.role}</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{t.allRoles}</option>
                <option value="admin">{t.admin}</option>
                <option value="editor">{t.editor}</option>
                <option value="author">{language === 'ur' ? 'مصنف' : 'Author'}</option>
                <option value="premium-user">{language === 'ur' ? 'پریمیم صارف' : 'Premium User'}</option>
                <option value="standard-user">{t.user}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {t.name}
                  </th>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {language === 'ur' ? 'ای میل' : 'Email'}
                  </th>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {t.role}
                  </th>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {language === 'ur' ? 'فون' : 'Phone'}
                  </th>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium ${language === 'ur' ? 'ml-4' : 'mr-4'}`}>
                          {user.firstName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {`${user.firstName} ${user.lastName}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-2 py-1 border-0 ${getRoleColor(user.role)}`}
                      >
                        <option value="standard-user">{t.user}</option>
                        <option value="premium-user">{language === 'ur' ? 'پریمیم صارف' : 'Premium User'}</option>
                        <option value="author">{language === 'ur' ? 'مصنف' : 'Author'}</option>
                        <option value="editor">{t.editor}</option>
                        <option value="admin">{t.admin}</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className={`flex ${language === 'ur' ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                        <button className="text-blue-600 hover:text-blue-900">
                          {t.details}
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteUser(user._id)}
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
      </div>
    </AdminLayout>
  );
};

export default AdminUsers; 