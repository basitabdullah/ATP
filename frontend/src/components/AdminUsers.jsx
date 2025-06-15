import { useState } from 'react';
import AdminLayout from './AdminLayout';
import { useLanguage, translations } from '../context/LanguageContext';

const AdminUsers = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'احمد علی',
      email: 'ahmad@example.com',
      role: 'user',
      status: 'active',
      joinDate: '2025، 5 جون',
      lastLogin: '2025، 10 جون',
      articlesRead: 45,
      comments: 12
    },
    {
      id: 2,
      name: 'فاطمہ خان',
      email: 'fatima@example.com',
      role: 'editor',
      status: 'active',
      joinDate: '2025، 3 جون',
      lastLogin: '2025، 9 جون',
      articlesRead: 89,
      comments: 23
    },
    {
      id: 3,
      name: 'محمد حسن',
      email: 'hassan@example.com',
      role: 'user',
      status: 'suspended',
      joinDate: '2025، 1 جون',
      lastLogin: '2025، 8 جون',
      articlesRead: 12,
      comments: 3
    }
  ]);

  const handleStatusChange = (id, newStatus) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, status: newStatus } : user
    ));
  };

  const handleRoleChange = (id, newRole) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, role: newRole } : user
    ));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return t.active;
      case 'suspended': return t.suspended;
      case 'pending': return t.pending;
      default: return status;
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return t.admin;
      case 'editor': return t.editor;
      case 'user': return t.user;
      default: return role;
    }
  };

  return (
    <AdminLayout currentPage="users">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t.userManagement}</h1>
            <p className="text-gray-600">{t.userManagementDesc}</p>
          </div>
          <div className={`flex ${language === 'ur' ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              {t.addUser}
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              {t.export}
            </button>
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
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <div className={language === 'ur' ? 'mr-4' : 'ml-4'}>
                <p className="text-sm font-medium text-gray-600">{t.activeUsers}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-purple-600 text-xl">👑</span>
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
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-red-600 text-xl">🚫</span>
              </div>
              <div className={language === 'ur' ? 'mr-4' : 'ml-4'}>
                <p className="text-sm font-medium text-gray-600">{t.suspended}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.status === 'suspended').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <option value="user">{t.user}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.status}</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{t.all}</option>
                <option value="active">{t.active}</option>
                <option value="suspended">{t.suspended}</option>
                <option value="pending">{t.pending}</option>
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
                    {t.role}
                  </th>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {t.status}
                  </th>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {t.joinDate}
                  </th>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {t.lastLogin}
                  </th>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {t.activity}
                  </th>
                  <th className={`px-6 py-3 ${language === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium ${language === 'ur' ? 'ml-4' : 'mr-4'}`}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-2 py-1 border-0 ${getRoleColor(user.role)}`}
                      >
                        <option value="user">{t.user}</option>
                        <option value="editor">{t.editor}</option>
                        <option value="admin">{t.admin}</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-2 py-1 border-0 ${getStatusColor(user.status)}`}
                      >
                        <option value="active">{t.active}</option>
                        <option value="suspended">{t.suspended}</option>
                        <option value="pending">{t.pending}</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.joinDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="text-sm">
                        <div>{user.articlesRead} {language === 'ur' ? 'خبریں پڑھیں' : 'articles read'}</div>
                        <div>{user.comments} {language === 'ur' ? 'تبصرے' : 'comments'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className={`flex ${language === 'ur' ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                        <button className="text-blue-600 hover:text-blue-900">
                          {t.details}
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          {t.message}
                        </button>
                        <button className="text-red-600 hover:text-red-900">
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