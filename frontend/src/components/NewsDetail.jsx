import { useState } from 'react';
import useAuthStore from '../stores/authStore';
import api from '../lib/axios';
import jsPDF from 'jspdf';
import { HiArrowDownTray, HiEye, HiChatBubbleLeft, HiArrowLeft, HiClock, HiUser } from 'react-icons/hi2';

const NewsDetail = ({ news, onBack, allNews = [] }) => {
  if (!news) return null;
  
  const { canDownload, user } = useAuthStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  
  // Filter news to get related news from the same category, excluding the current news
  const relatedNews = allNews
    .filter(item => item.category === news.category && item.id !== news.id)
    .slice(0, 3);

  const handleDownload = async () => {
    if (!canDownload()) {
      setDownloadError(user ? 'Download access is available for premium users only. Please upgrade your account.' : 'Please login to download news.');
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadError(null);
      
      // Call the download API endpoint to increment counter
      const newsId = news._id || news.id;
      if (!newsId) {
        throw new Error('News ID not found');
      }
      await api.patch(`/news/${newsId}/download`);
      
      // Create simple PDF that handles Urdu text properly
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Function to safely convert text for PDF (remove problematic chars but keep basic info)
      const safeTextForPDF = (text) => {
        if (!text) return '';
        // Check if text contains Urdu/Arabic characters
        const hasUrdu = /[\u0600-\u06FF\u0750-\u077F]/.test(text);
        
        if (hasUrdu) {
          // For Urdu text, provide a placeholder
          return '[Urdu/Arabic content - view original article for full text]';
        } else {
          // For English text, clean and return
          return text.replace(/[^\x20-\x7E]/g, '').trim();
        }
      };

      // Add header
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 102, 204); // Blue color
      doc.text('ATP News Article', 20, 30);
      
      // Add separator line
      doc.setDrawColor(0, 102, 204);
      doc.setLineWidth(1);
      doc.line(20, 40, 190, 40);
      
      let yPos = 55;
      
      // Add metadata section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text('Article Information:', 20, yPos);
      yPos += 12;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60);
      
      // Original title (in English or as placeholder)
      const titleText = safeTextForPDF(news.title) || 'News Article';
      const titleLines = doc.splitTextToSize(`Title: ${titleText}`, 170);
      doc.text(titleLines, 20, yPos);
      yPos += titleLines.length * 6 + 5;
      
      // Metadata
      const currentDate = new Date(news.createdAt || Date.now()).toLocaleDateString();
      doc.text(`Published: ${currentDate}`, 20, yPos);
      yPos += 8;
      
      const category = safeTextForPDF(news.category) || 'General';
      doc.text(`Category: ${category}`, 20, yPos);
      yPos += 8;
      
      const author = safeTextForPDF(news.authorName) || 'ATP News';
      doc.text(`Author: ${author}`, 20, yPos);
      yPos += 15;
      
      // Content section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text('Content:', 20, yPos);
      yPos += 12;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60);
      
      // Check if article has Urdu content
      const hasUrduTitle = /[\u0600-\u06FF\u0750-\u077F]/.test(news.title || '');
      const hasUrduExcerpt = /[\u0600-\u06FF\u0750-\u077F]/.test(news.excerpt || '');
      const hasUrduContent = /[\u0600-\u06FF\u0750-\u077F]/.test(news.content || '');
      
      if (hasUrduTitle || hasUrduExcerpt || hasUrduContent) {
        // Urdu content notice
        const urduNotice = [
          'NOTICE: This article contains Urdu/Arabic text.',
          '',
          'Due to PDF font limitations, the original Urdu text cannot be',
          'properly displayed in this PDF format. To read the complete',
          'article with proper Urdu formatting, please view it on the',
          'ATP News website.',
          '',
          'Article Details:',
          `- Original language: Urdu/Arabic`,
          `- Publication date: ${currentDate}`,
          `- Category: ${category}`,
          `- Available online at ATP News Platform`,
          '',
          'This PDF serves as a download receipt and basic reference.',
          'For the full reading experience, please access the article',
          'through the ATP News website or mobile application.'
        ];
        
        urduNotice.forEach(line => {
          if (line === '') {
            yPos += 4;
          } else {
            const textLines = doc.splitTextToSize(line, 170);
            doc.text(textLines, 20, yPos);
            yPos += textLines.length * 6 + 2;
          }
        });
      } else {
        // English content - display normally
        if (news.excerpt) {
          doc.setFont('helvetica', 'bold');
          doc.text('Summary:', 20, yPos);
          yPos += 8;
          doc.setFont('helvetica', 'normal');
          const excerptLines = doc.splitTextToSize(news.excerpt, 170);
          doc.text(excerptLines, 20, yPos);
          yPos += excerptLines.length * 6 + 10;
        }
        
        if (news.content) {
          doc.setFont('helvetica', 'bold');
          doc.text('Full Article:', 20, yPos);
          yPos += 8;
          doc.setFont('helvetica', 'normal');
          const contentLines = doc.splitTextToSize(news.content, 170);
          doc.text(contentLines, 20, yPos);
        }
      }
      
      // Add footer
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text('Downloaded from ATP News Platform', 20, 270);
      doc.text(`Download Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 275);
      doc.text('Visit ATP News for the latest updates and complete articles', 20, 280);
      
      // Generate filename (English only to avoid file system issues)
      const fileName = `atp_news_${Date.now()}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Download error:', error);
      setDownloadError(error.response?.data?.message || 'Failed to download. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-urdu">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
        >
          <HiArrowLeft className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          واپس خبروں کی فہرست پر
        </button>

        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            {/* Featured Image */}
            <div className="relative">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
                  {news.category}
                </span>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-8">
              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-800 leading-relaxed text-right mb-4">
                {news.title}
              </h1>

              {/* Meta Information */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                              <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                <span className="flex items-center">
                  <HiEye className="ml-1 w-4 h-4" />
                  {news.views}
                </span>
                <span className="flex items-center">
                  <HiChatBubbleLeft className="ml-1 w-4 h-4" />
                  {news.comments}
                </span>
                {/* Circular Download Button */}
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={`group w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md ${
                    canDownload()
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 disabled:cursor-not-allowed'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                  }`}
                  title={canDownload() ? 'Download this news article as PDF' : 'Premium access required for downloads'}
                >
                  <HiArrowDownTray className={`w-5 h-5 transition-transform ${isDownloading ? 'animate-bounce' : 'group-hover:scale-110'}`} />
                </button>
              </div>
                <div className="text-sm text-gray-600 text-right">
                  <div className="font-medium flex items-center justify-end">
                    <HiUser className="ml-1 w-4 h-4" />
                    {news.source}
                  </div>
                  <div className="flex items-center justify-end mt-1">
                    <HiClock className="ml-1 w-4 h-4" />
                    {news.time}
                  </div>
                </div>
              </div>

              {/* Download Error Message */}
              {downloadError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm text-right">{downloadError}</p>
                  {!user && (
                    <button
                      onClick={() => window.location.href = '/login'}
                      className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium underline"
                    >
                      Login here
                    </button>
                  )}
                </div>
              )}

              {/* Article Body */}
              <div className="prose prose-lg max-w-none text-right">
                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                  {news.excerpt}
                </p>
                
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    یہ خبر کی تفصیلات یہاں آئیں گی۔ اس میں مکمل خبر کا متن، تجزیہ اور متعلقہ معلومات شامل ہوں گی۔ 
                    صحافتی معیارات کے مطابق یہ خبر مختلف ذرائع سے تصدیق کے بعد شائع کی گئی ہے۔
                  </p>
                  
                  <p>
                    اس واقعے کے حوالے سے مزید تفصیلات کے لیے متعلقہ حکام سے رابطہ کیا گیا ہے۔ 
                    حکومتی ذرائع کے مطابق اس معاملے میں مزید پیش رفت کی توقع ہے۔
                  </p>
                  
                  <p>
                    عوام کی جانب سے اس خبر پر مختلف ردعمل سامنے آئے ہیں۔ سوشل میڈیا پر بھی اس موضوع پر 
                    بحث جاری ہے اور لوگ اپنی آراء کا اظہار کر رہے ہیں۔
                  </p>
                  
                  <p>
                    ماہرین کا کہنا ہے کہ یہ واقعہ مستقبل میں اہم تبدیلیاں لا سکتا ہے۔ 
                    اس حوالے سے مزید تجزیہ اور رپورٹنگ جاری رہے گی۔
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {/* Category tag */}
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">#{news.category}</span>
                    
                    {/* Actual tags from news data */}
                    {news.tags && news.tags.length > 0 ? (
                      news.tags.map((tag, index) => (
                        <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          #{tag}
                        </span>
                      ))
                    ) : (
                      // Fallback tags if no tags are available
                      <>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">#خبریں</span>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">#تازہ_ترین</span>
                      </>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-2">شیئر کریں:</div>
                    <div className="flex space-x-2 space-x-reverse">
                      <button className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                        f
                      </button>
                      <button className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors">
                        t
                      </button>
                      <button className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors">
                        w
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related News */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-right border-b border-blue-600 pb-2">
              متعلقہ خبریں
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedNews.length > 0 ? (
                relatedNews.map((relatedItem) => (
                  <div 
                    key={relatedItem.id} 
                    className="flex items-start space-x-3 space-x-reverse p-3 hover:bg-gray-50 rounded transition-colors cursor-pointer"
                    onClick={() => {
                      // This would ideally navigate to the related news
                      // For now, we'll just log it
                      console.log('Related news clicked:', relatedItem.title);
                    }}
                  >
                    <img
                      src={relatedItem.image}
                      alt={relatedItem.title}
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-800 leading-relaxed text-right mb-1">
                        {relatedItem.title.length > 60 ? relatedItem.title.substring(0, 60) + '...' : relatedItem.title}
                      </h3>
                      <div className="text-xs text-gray-500 text-right">
                        <span className="text-yellow-600">{relatedItem.category}</span>
                        <span className="mx-2">•</span>
                        <span>{relatedItem.time}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">📰</div>
                  <p className="text-gray-600">اس کیٹگری میں کوئی متعلقہ خبر دستیاب نہیں</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;