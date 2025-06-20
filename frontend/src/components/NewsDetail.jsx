const NewsDetail = ({ news, onBack, allNews = [] }) => {
  if (!news) return null;
  
  // Filter news to get related news from the same category, excluding the current news
  const relatedNews = allNews
    .filter(item => item.category === news.category && item.id !== news.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 font-urdu">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span className="ml-2">←</span>
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
                    <span className="ml-1">👁</span>
                    {news.views}
                  </span>
                  <span className="flex items-center">
                    <span className="ml-1">💬</span>
                    {news.comments}
                  </span>
                </div>
                <div className="text-sm text-gray-600 text-right">
                  <div className="font-medium">{news.source}</div>
                  <div>{news.time}</div>
                </div>
              </div>

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