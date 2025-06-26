import { TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerLinks = {
    'Quick Links': ['HOME', 'ABOUT', 'CONTACT US'],
    'Services': ['SUBSCRIPTION ENQUIRY', 'PUBLIC NOTICES', 'PRESS RELEASES', 'PRODUCTS'],
    'Policies': ['CORRECTIONS POLICY', 'DECLARATION', 'Privacy Policy', 'Terms of Service']
  };

  return (
    <footer className="bg-gray-900 text-white" dir="ltr">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <img src="logo.jpg" alt="logo" className="w-20 h-15 rounded-full" />
              </div>
              <div className="ml-3">
                <div className="text-lg font-semibold">ATP - Arcanum Tide Press</div>
                <div className="text-sm text-gray-400">News & Digital Publishing</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4" dir="rtl">
              ATP ایک اعلیٰ ڈیجیٹل نیوز اور پبلشنگ پلیٹ فارم ہے جو جامع خبروں کی کوریج، پریس ریلیزز، اور ڈیجیٹل پبلشنگ حل فراہم کرتا ہے۔ قابل اعتماد معلومات اور جدید پبلشنگ خدمات کے لیے آپ کا بھروسہ مند ذریعہ۔
            </p>
            <div className="flex space-x-2">
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
              <h3 className="font-semibold text-lg mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    {link === 'Privacy Policy' ? (
                      <Link
                        to="/privacy-policy"
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm block"
                      >
                        {link}
                      </Link>
                    ) : (
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm block"
                      >
                        {link}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="text-center">
            <div className="text-sm text-gray-400" dir="rtl">
              <p>© 2025 ATP - آرکینم ٹائیڈ پریس۔ تمام حقوق محفوظ ہیں۔</p>
              <p className="mt-1">تمام مواد ATP کی ملکیت ہے۔</p>
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