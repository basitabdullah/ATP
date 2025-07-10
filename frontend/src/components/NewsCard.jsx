import { useState } from 'react';
import useAuthStore from '../stores/authStore';
import api from '../lib/axios';
import { HiArrowDownTray, HiClock, HiTag } from 'react-icons/hi2';

const NewsCard = ({ news, featured = false, small = false }) => {
  const { canDownload } = useAuthStore();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e) => {
    e.stopPropagation(); // Prevent card click event
    e.preventDefault(); // Prevent default behavior
    
    if (!canDownload()) {
      alert('Download access is available for premium users only. Please upgrade your account or login.');
      return;
    }

    try {
      setIsDownloading(true);
      const newsId = news._id || news.id;
      if (!newsId) {
        throw new Error('News ID not found');
      }
      
      // Call API to increment download counter
      await api.patch(`/news/${newsId}/download`);
      
      // Create text content for download
      const currentDate = new Date(news.createdAt || Date.now()).toLocaleDateString('ur-PK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const textContent = `
ATP News Article
================

Title: ${news.title || 'Untitled News'}

Category: ${news.category || 'General'}
Author: ${news.source || 'ATP News'}
Published: ${currentDate}

Summary:
--------
${news.excerpt || 'No summary available'}

Full Article:
-------------
${news.content || 'Content not available'}

Tags: ${news.tags ? news.tags.join(', ') : 'No tags'}

---
Downloaded from ATP News Platform
Download Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
Visit ATP News for the latest updates and complete articles
`;

      // Create and download the text file
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with safe characters
      const safeTitle = news.title 
        ? news.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').substring(0, 50)
        : 'news_article';
      const fileName = `${safeTitle}_${Date.now()}.txt`;
      
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download error:', error);
      alert(error.response?.data?.message || 'Failed to download. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };
  if (small) {
    return (
      <div className="flex items-start space-x-3 space-x-reverse p-3 hover:bg-gray-50 transition-colors">
        <img
          src={news.image}
          alt={news.title}
          className="w-16 h-16 object-cover rounded flex-shrink-0"
        />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-800 leading-relaxed text-right mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
            {news.title}
          </h3>
          <div className="text-xs text-gray-500 text-right flex items-center justify-end gap-2 whitespace-nowrap overflow-hidden">
            <span className="text-yellow-600 flex items-center gap-1">
              <HiTag className="w-3 h-3" />
              {news.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <HiClock className="w-3 h-3" />
              {news.time}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (featured) {
    return (
      <div className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 right-4 left-4">
            <h2 className="text-white text-xl font-bold leading-relaxed text-right mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
              {news.title}
            </h2>
            <div className="text-yellow-300 text-sm text-right flex items-center justify-end">
              <HiClock className="ml-1 w-4 h-4" />
              <span>{news.time}</span>
              <span className="mx-2">•</span>
              <span>10 جون</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row border border-gray-300 bg-white rounded-md overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <img
        src={news.image}
        alt={news.title}
        className="w-full md:w-56 h-48 md:h-auto object-cover flex-shrink-0"
      />

      {/* Content */}
      <div className="px-6 py-4 md:px-8 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-bold text-gray-800 text-lg mb-2 py-1 line-clamp-2">
          {news.title}
        </h3>

        {/* Tags and time */}
        <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
          {/* Tags */}
          {news.tags && news.tags.length > 0 && (
            news.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium"
              >
                {tag}
              </span>
            ))
          )}
          {/* Date */}
          {news.time && (
            <span className="text-red-600 font-medium">{news.time}</span>
          )}
        </div>

        {/* Excerpt */}
        <p className="text-gray-700 text-sm flex-1 line-clamp-3 py-2 mb-4">
          {news.excerpt || (news.content ? news.content.substring(0, 220) + '...' : '')}
        </p>

        {/* Download button & category/time */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
            <HiTag className="w-4 h-4 text-yellow-600" />
            <span>{news.category}</span>
            <span className="mx-1">•</span>
            <HiClock className="w-4 h-4" />
            <span>{news.time}</span>
          </div>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`group w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md ${
              canDownload()
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-300'
            }`}
            title={canDownload() ? 'Download this news as text file' : 'Premium access required'}
          >
            <HiArrowDownTray className={`w-4 h-4 transition-transform ${isDownloading ? 'animate-bounce' : 'group-hover:scale-110'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;