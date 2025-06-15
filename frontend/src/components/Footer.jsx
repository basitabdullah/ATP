import { TrendingUp } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    'ٹریڈنگ': ['لائیو ٹریڈنگ', 'بوٹ ٹریڈنگ', 'کاپی ٹریڈنگ', 'فیوچرز', 'آپشنز'],
    'کمپنی': ['ہمارے بارے میں', 'رابطہ', 'ٹیم', 'کیریئر', 'اشتہارات'],
    'خدمات': ['موبائل ایپ', 'API', 'مارکیٹ ڈیٹا', 'تجزیات', 'سگنلز'],
    'مدد': ['اکثر پوچھے جانے والے سوالات', 'رپورٹ کریں', 'فیڈبیک', 'پرائیویسی پالیسی', 'شرائط']
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-indigo-400 ml-3" />
                <div className="text-2xl font-bold text-white">ATP</div>
              </div>
              <div className="text-right mr-3">
                <div className="text-lg font-semibold">آٹو ٹریڈنگ پلیٹ فارم</div>
                <div className="text-sm text-gray-400">ذہین ٹریڈنگ حل</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed text-right mb-4">
              ATP ایک جدید ترین آٹو ٹریڈنگ پلیٹ فارم ہے جو مصنوعی ذہانت کا استعمال کرتے ہوئے 
              بہترین ٹریڈنگ کے مواقع فراہم کرتا ہے۔ ہمارا مقصد آپ کو بہتر مالی نتائج دینا ہے۔
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">f</div>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">t</div>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">i</div>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">y</div>
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-4 text-right">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm text-right block"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 text-center md:text-right mb-4 md:mb-0">
              <p>© 2024 ATP - آٹو ٹریڈنگ پلیٹ فارم. تمام حقوق محفوظ ہیں۔</p>
              <p className="mt-1">Powered by AI & Modern Technologies</p>
            </div>
            <div className="flex items-center space-x-6 space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                پرائیویسی پالیسی
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                استعمال کی شرائط
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                کوکیز پالیسی
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 left-6 bg-indigo-600 text-white w-12 h-12 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center z-40"
      >
        ↑
      </button>
    </footer>
  );
};

export default Footer;