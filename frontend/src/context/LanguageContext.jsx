import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Admin Layout
    adminPanel: 'Admin Panel',
    dashboard: 'Dashboard',
    newsManagement: 'News Management',
    categories: 'Categories',
    users: 'Users',

    settings: 'Settings',
    logout: 'Logout',
    notifications: 'Notifications',
    admin: 'Admin',
    
    // Dashboard
    welcome: 'Welcome, Admin!',
    todayDate: 'Today\'s Date',
    totalNews: 'Total News',
    totalUsers: 'Total Users',
    todayViews: 'Today\'s Views',
    totalComments: 'Total Comments',
    fromLastMonth: 'from last month',
    recentNews: 'Recent News',
    viewAll: 'View All',
    published: 'Published',
    draft: 'Draft',
    quickActions: 'Quick Actions',
    addNews: 'Add News',
    addCategory: 'Add Category',
    manageUsers: 'Manage Users',
    popularCategories: 'Popular Categories',
    systemStatus: 'System Status',
    server: 'Server',
    database: 'Database',
    backup: 'Backup',
    active: 'Active',
    inProgress: 'In Progress',
    
    // News Management
    newsManagement: 'News Management',
    searchNews: 'Search News',
    searchPlaceholder: 'News title or category...',
    status: 'Status',
    all: 'All',
    category: 'Category',
    allCategories: 'All Categories',
    
    // Users Management
    userManagement: 'User Management',
    searchUsers: 'Search Users',
    searchUserPlaceholder: 'Name or email...',
    role: 'Role',
    allRoles: 'All Roles',
    user: 'User',
    editor: 'Editor',
    status: 'Status',
    active: 'Active',
    suspended: 'Suspended',
    pending: 'Pending',
    joinDate: 'Join Date',
    lastLogin: 'Last Login',
    activity: 'Activity',
    actions: 'Actions',
    details: 'Details',
    message: 'Message',
    delete: 'Delete',
    addUser: 'Add User',
    export: 'Export',
    
    // Categories
    categoryManagement: 'Category Management',
    totalCategories: 'Total Categories',
    activeCategories: 'Active Categories',
    totalNews: 'Total News',
    
    // News Management Extended
    newsManagementDesc: 'View, edit and add all news articles',
    addNewsButton: 'Add New Article',
    search: 'Search',
    title: 'Title',
    views: 'Views',
    date: 'Date',
    author: 'Author',
    edit: 'Edit',
    
    // Categories Extended
    categoryManagementDesc: 'Organize news categories and add new categories',
    addCategoryButton: 'Add New Category',
    description: 'Description',
    color: 'Color',
    newsCount: 'News Count',
    createdDate: 'Created Date',
    
    // Users Extended
    userManagementDesc: 'View and manage all users',
    totalUsers: 'Total Users',
    activeUsers: 'Active Users',
    editors: 'Editors',
    suspended: 'Suspended',
    name: 'Name',
    email: 'Email',
    
    // Common Actions
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    
    // Popular Categories Data
    technology: 'Technology',
    finance: 'Finance',
    stockMarket: 'Stock Market',
    aiTrading: 'AI Trading',
    financialPlanning: 'Financial Planning',
    education: 'Education',
    
    // Colors
    blue: 'Blue',
    green: 'Green',
    orange: 'Orange',
    purple: 'Purple',
    red: 'Red',
    gray: 'Gray',
  },
  ur: {
    // Admin Layout
    adminPanel: 'ایڈمن پینل',
    dashboard: 'ڈیش بورڈ',
    newsManagement: 'خبروں کا انتظام',
    categories: 'کیٹگریز',
    users: 'صارفین',

    settings: 'سیٹنگز',
    logout: 'لاگ آؤٹ',
    notifications: 'نوٹیفیکیشنز',
    admin: 'ایڈمن',
    
    // Dashboard
    welcome: 'خوش آمدید، ایڈمن!',
    todayDate: 'آج کی تاریخ',
    totalNews: 'کل خبریں',
    totalUsers: 'کل صارفین',
    todayViews: 'آج کے مناظر',
    totalComments: 'کل تبصرے',
    fromLastMonth: 'پچھلے مہینے سے',
    recentNews: 'حالیہ خبریں',
    viewAll: 'تمام دیکھیں',
    published: 'شائع شدہ',
    draft: 'مسودہ',
    quickActions: 'فوری اعمال',
    addNews: 'نئی خبر شامل کریں',
    addCategory: 'کیٹگری شامل کریں',
    manageUsers: 'صارف کا انتظام',
    popularCategories: 'مقبول کیٹگریز',
    systemStatus: 'سسٹم کی صورتحال',
    server: 'سرور',
    database: 'ڈیٹابیس',
    backup: 'بیک اپ',
    active: 'فعال',
    inProgress: 'جاری',
    
    // News Management
    newsManagement: 'خبروں کا انتظام',
    searchNews: 'تلاش کریں',
    searchPlaceholder: 'خبر کا عنوان یا کیٹگری...',
    status: 'صورتحال',
    all: 'تمام',
    category: 'کیٹگری',
    allCategories: 'تمام کیٹگریز',
    
    // Users Management
    userManagement: 'صارفین کا انتظام',
    searchUsers: 'تلاش کریں',
    searchUserPlaceholder: 'نام یا ای میل...',
    role: 'کردار',
    allRoles: 'تمام کردار',
    user: 'صارف',
    editor: 'ایڈیٹر',
    status: 'صورتحال',
    active: 'فعال',
    suspended: 'معطل',
    pending: 'زیر التواء',
    joinDate: 'شمولیت',
    lastLogin: 'آخری لاگ ان',
    activity: 'سرگرمی',
    actions: 'اعمال',
    details: 'تفصیلات',
    message: 'پیغام',
    delete: 'حذف',
    addUser: 'نیا صارف شامل کریں',
    export: 'ایکسپورٹ',
    
    // Categories
    categoryManagement: 'کیٹگریز کا انتظام',
    totalCategories: 'کل کیٹگریز',
    activeCategories: 'فعال کیٹگریز',
    totalNews: 'کل خبریں',
    
    // News Management Extended
    newsManagementDesc: 'تمام خبروں کو دیکھیں، ترمیم کریں اور نئی خبریں شامل کریں',
    addNewsButton: 'نئی خبر شامل کریں',
    search: 'تلاش کریں',
    title: 'عنوان',
    views: 'مناظر',
    date: 'تاریخ',
    author: 'مصنف',
    edit: 'ترمیم',
    
    // Categories Extended
    categoryManagementDesc: 'خبروں کی کیٹگریز کو منظم کریں اور نئی کیٹگریز شامل کریں',
    addCategoryButton: 'نئی کیٹگری شامل کریں',
    description: 'تفصیل',
    color: 'رنگ',
    newsCount: 'خبروں کی تعداد',
    createdDate: 'بنانے کی تاریخ',
    
    // Users Extended
    userManagementDesc: 'تمام صارفین کو دیکھیں اور ان کا انتظام کریں',
    totalUsers: 'کل صارفین',
    activeUsers: 'فعال صارفین',
    editors: 'ایڈیٹرز',
    suspended: 'معطل شدہ',
    name: 'نام',
    email: 'ای میل',
    
    // Common Actions
    save: 'محفوظ کریں',
    cancel: 'منسوخ',
    confirm: 'تصدیق',
    close: 'بند کریں',
    
    // Popular Categories Data
    technology: 'ٹیکنالوجی',
    finance: 'مالیات',
    stockMarket: 'اسٹاک مارکیٹ',
    aiTrading: 'AI ٹریڈنگ',
    financialPlanning: 'مالی منصوبہ بندی',
    education: 'تعلیم',
    
    // Colors
    blue: 'نیلا',
    green: 'سبز',
    orange: 'نارنجی',
    purple: 'بنفشی',
    red: 'سرخ',
    gray: 'سرمئی',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ur');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ur' ? 'en' : 'ur');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 