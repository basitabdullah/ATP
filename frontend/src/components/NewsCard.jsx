const NewsCard = ({ news, featured = false, small = false }) => {
  if (small) {
    return (
      <div className="flex items-start space-x-3 space-x-reverse p-3 hover:bg-gray-50 transition-colors">
        <img
          src={news.image}
          alt={news.title}
          className="w-16 h-16 object-cover rounded flex-shrink-0"
        />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-800 leading-relaxed text-right mb-1">
            {news.title}
          </h3>
          <div className="text-xs text-gray-500 text-right">
            <span className="text-yellow-600">{news.category}</span>
            <span className="mx-2">•</span>
            <span>{news.time}</span>
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
            <h2 className="text-white text-xl font-bold leading-relaxed text-right mb-2">
              {news.title}
            </h2>
            <div className="text-yellow-300 text-sm text-right">
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
        <h3 className="font-semibold text-gray-800 text-right leading-relaxed mb-2">
          {news.title}
        </h3>
        <div className="text-sm text-gray-500 text-right">
          <span className="text-yellow-600">{news.category}</span>
          <span className="mx-2">•</span>
          <span>{news.time}</span>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;