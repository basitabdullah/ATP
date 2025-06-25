import { useState } from 'react';
import useAuthStore from '../stores/authStore';
import api from '../lib/axios';
import jsPDF from 'jspdf';
import { HiArrowDownTray, HiClock, HiTag } from 'react-icons/hi2';

const NewsCard = ({ news, featured = false, small = false }) => {
  const { canDownload } = useAuthStore();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e) => {
    e.stopPropagation(); // Prevent card click event
    
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
      
      // Create simple PDF that handles Urdu text properly
      const doc = new jsPDF();
      doc.setFont('helvetica');
      
      // Function to safely convert text for PDF
      const safeTextForPDF = (text) => {
        if (!text) return '';
        const hasUrdu = /[\u0600-\u06FF\u0750-\u077F]/.test(text);
        
        if (hasUrdu) {
          return '[Urdu/Arabic content - view original article]';
        } else {
          return text.replace(/[^\x20-\x7E]/g, '').trim();
        }
      };
      
      // Add header
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 102, 204);
      doc.text('ATP News Download', 20, 30);
      
      // Add separator line
      doc.setDrawColor(0, 102, 204);
      doc.line(20, 40, 190, 40);
      
      let yPos = 55;
      
      // Add title info
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text('Article Information:', 20, yPos);
      yPos += 12;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60);
      
      const titleText = safeTextForPDF(news.title) || 'News Article';
      const titleLines = doc.splitTextToSize(`Title: ${titleText}`, 170);
      doc.text(titleLines, 20, yPos);
      yPos += titleLines.length * 6 + 5;
      
      const category = safeTextForPDF(news.category) || 'General';
      doc.text(`Category: ${category}`, 20, yPos);
      yPos += 8;
      doc.text(`Downloaded from: ATP News Platform`, 20, yPos);
      yPos += 8;
      doc.text(`Download Date: ${new Date().toLocaleDateString()}`, 20, yPos);
      yPos += 15;
      
      // Check if has Urdu content
      const hasUrdu = /[\u0600-\u06FF\u0750-\u077F]/.test(news.title || '') || 
                     /[\u0600-\u06FF\u0750-\u077F]/.test(news.excerpt || '');
      
      if (hasUrdu) {
        // Urdu content notice
        doc.setFont('helvetica', 'bold');
        doc.text('Notice:', 20, yPos);
        yPos += 8;
        doc.setFont('helvetica', 'normal');
        
        const notice = [
          'This article contains Urdu/Arabic text that cannot be',
          'properly displayed in PDF format due to font limitations.',
          '',
          'To read the complete article with proper formatting,',
          'please view it on the ATP News website.',
          '',
          'This PDF serves as a download receipt.'
        ];
        
        notice.forEach(line => {
          if (line === '') {
            yPos += 4;
          } else {
            const lines = doc.splitTextToSize(line, 170);
            doc.text(lines, 20, yPos);
            yPos += lines.length * 6 + 2;
          }
        });
      } else {
        // English content
        if (news.excerpt) {
          doc.setFont('helvetica', 'bold');
          doc.text('Summary:', 20, yPos);
          yPos += 8;
          doc.setFont('helvetica', 'normal');
          const excerptLines = doc.splitTextToSize(news.excerpt, 170);
          doc.text(excerptLines, 20, yPos);
        }
      }
      
      // Add footer
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text('ATP News Platform - Visit website for complete articles', 20, 270);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 275);
      
      // Generate simple filename
      const fileName = `atp_news_download_${Date.now()}.pdf`;
      doc.save(fileName);
      
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
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200">
      <div className="relative">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-right leading-relaxed mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
          {news.title}
        </h3>
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`group w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md ${
              canDownload()
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-300'
            }`}
            title={canDownload() ? 'Download this news as PDF' : 'Premium access required'}
          >
            <HiArrowDownTray className={`w-4 h-4 transition-transform ${isDownloading ? 'animate-bounce' : 'group-hover:scale-110'}`} />
          </button>
          <div className="text-sm text-gray-500 text-right flex items-center justify-end gap-2 whitespace-nowrap overflow-hidden">
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
    </div>
  );
};

export default NewsCard;