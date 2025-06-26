import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-urdu">
      {/* Simplified Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.jpg" 
              alt="ATP Logo" 
              className="h-12 w-auto object-contain mr-3 rounded-full"
            />
            <div className="mr-3 text-gray-600">
              <div className="text-sm font-medium">آرکینم ٹائیڈ پریس</div>
            </div>
          </Link>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back to Home */}
          <Link 
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6"
          >
            <span className="ml-2">←</span>
            واپس ہوم پیج پر
          </Link>

          {/* Privacy Policy Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8" dir="rtl">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
              رازداری کی پالیسی
            </h1>

            <div className="prose prose-lg max-w-none space-y-6 text-right">
              
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">۱۔ تعارف</h2>
                <p className="text-gray-700 leading-relaxed">
                  آرکینم ٹائیڈ پریس (ATP) میں خوش آمدید۔ یہ رازداری کی پالیسی وضاحت کرتی ہے کہ جب آپ ہماری خدمات استعمال کرتے ہیں تو ہم آپ کی ذاتی معلومات کیسے جمع، استعمال اور محفوظ کرتے ہیں۔ ہماری ویب سائٹ تک رسائی کے ذریعے، آپ اس پالیسی سے اتفاق کرتے ہیں۔ ہم اسے وقتاً فوقتاً اپ ڈیٹ کر سکتے ہیں؛ تبدیلیاں پوسٹ کرنے کے فوراً بعد نافذ ہو جاتی ہیں۔
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">۲۔ ہم جو معلومات جمع کرتے ہیں</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ہم دو قسم کی ڈیٹا جمع کرتے ہیں:
                </p>
                
                <div className="mr-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">الف۔ ذاتی شناختی معلومات</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                    <li><strong>اکاؤنٹ رجسٹریشن:</strong> نام، ای میل، پاس ورڈ (انکرپٹ شدہ)۔</li>
                    <li><strong>ادائیگی کی ڈیٹا:</strong> تیسرے فریق کے ذریعے پروسیس کیا جاتا ہے (جیسے Razorpay)؛ ہم صرف کارڈ کے آخری 4 ہندسے محفوظ کرتے ہیں۔</li>
                    <li><strong>رابطے:</strong> ای میلز، چیٹ لاگز، سروے کے جوابات۔</li>
                    <li><strong>عوامی پروفائل:</strong> نک نیم، پروفائل تصویر، سوشل لنکس، شائع شدہ مواد۔</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">ب۔ غیر ذاتی معلومات (خودکار طور پر جمع شدہ)</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                    <li><strong>کوکیز اور ویب بیکنز:</strong> سائٹ کے استعمال کو ٹریک کرتے ہیں (آپٹ آؤٹ دستیاب)۔</li>
                    <li><strong>لاگ ڈیٹا:</strong> IP، ڈیوائس کی قسم، OS، براؤزر، سیشن کی مدت۔</li>
                    <li><strong>موبائل تجزیات:</strong> ایپ استعمال کی میٹرکس (PII سے منسلک نہیں)۔</li>
                    <li><strong>ایمبیڈڈ مواد:</strong> تیسرے فریق کے انضمام کے ساتھ تعامل۔</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">۳۔ ہم آپ کی ڈیٹا کا استعمال کیسے کرتے ہیں</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                  <li><strong>مقصد:</strong> خدمات کی فراہمی (معاہدہ کی ذمہ داری)۔</li>
                  <li><strong>اکاؤنٹ کی سیکیورٹی:</strong> جائز مفاد۔</li>
                  <li><strong>مارکیٹنگ کمیونیکیشنز:</strong> رضامندی (آپٹ آؤٹ دستیاب)۔</li>
                  <li><strong>تجزیات اور بہتری:</strong> جائز مفاد۔</li>
                  <li><strong>قانونی تعمیل:</strong> قانونی ذمہ داری۔</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">۴۔ ڈیٹا شیئرنگ اور تیسرے فریق</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                  <li><strong>تجزیات:</strong> Google Analytics، ATP (گمنام استعمال کی اعداد و شمار)۔</li>
                  <li><strong>کلاؤڈ اسٹوریج:</strong> محفوظ ڈیٹا ہوسٹنگ۔</li>
                  <li>ڈیٹا کی فروخت نہیں۔ بھارت کے باہر منتقلی۔</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">۵۔ آپ کے حقوق</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                  <li><strong>رسائی/پورٹیبلٹی:</strong> اپنی ڈیٹا کی کاپی کی درخواست کریں۔</li>
                  <li><strong>درستگی:</strong> اکاؤنٹ سیٹنگز کے ذریعے غلط معلومات کو اپ ڈیٹ کریں۔</li>
                  <li><strong>ڈیلیٹ کرنا:</strong> اپنا اکاؤنٹ ڈیلیٹ کریں (قانونی حفظ کے لیے استثناء لاگو)۔</li>
                  <li><strong>اعتراض:</strong> مارکیٹنگ ای میلز سے آپٹ آؤٹ کریں۔</li>
                  <li><strong>شکایات:</strong> ہمارے بھارتی نمائندے سے رابطہ کریں: ریزیڈنسی روڈ، سرینگر، کشمیر - 190001۔</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  حقوق کا استعمال کرنے کے لیے، ای میل کریں: <a href="mailto:ask@GFlip.kom.ac" className="text-blue-600 hover:text-blue-800">ask@GFlip.kom.ac</a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">۶۔ ڈیٹا محفوظیت</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                  <li><strong>فعال اکاؤنٹس:</strong> ڈیلیٹ کرنے تک ڈیٹا محفوظ کیا جاتا ہے۔</li>
                  <li><strong>بیک اپس:</strong> ڈیلیٹ شدہ ڈیٹا بیک اپس میں عارضی طور پر برقرار رہ سکتا ہے۔</li>
                  <li><strong>قانونی ذمہ داریاں:</strong> ضرورت کے مطابق پیمنٹ/ٹیکس ریکارڈز محفوظ کریں۔</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  <strong>نوٹ:</strong> سرچ انجنز عوامی مواد کو کیش کر سکتے ہیں؛ ہم ان کی انڈیکسنگ کو کنٹرول نہیں کر سکتے۔
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">۷۔ بچوں کی رازداری</h2>
                <p className="text-gray-700 leading-relaxed">
                  خدمات 18 سال سے کم عمر کے صارفین کے لیے نہیں ہیں۔ ہم کم عمر صارفین کے اکاؤنٹس کو شناخت کے بعد ڈیلیٹ کر دیتے ہیں۔
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">۸۔ سیکیورٹی کے اقدامات</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                  <li><strong>انکرپشن:</strong> پاس ورڈز ہیش شدہ؛ پیمنٹ ڈیٹا ٹوکنائزڈ۔</li>
                  <li><strong>رسائی کنٹرولز:</strong> صرف مجاز عملے تک محدود۔</li>
                  <li><strong>باقاعدہ آڈٹس:</strong> تعمیل کو یقینی بنانے کے لیے۔</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">۹۔ اپڈیٹس اور رابطہ</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                  <li><strong>پالیسی تبدیلیاں:</strong> اس صفحے پر پوسٹ کی گئی؛ اہم اپڈیٹس ای میل کے ذریعے اطلاع دی جاتی ہیں۔</li>
                  <li><strong>سوالات؟</strong> رابطہ: <a href="mailto:ask@GFlip.kom.ac" className="text-blue-600 hover:text-blue-800">ask@GFlip.kom.ac</a></li>
                </ul>
              </section>

              {/* Last Updated */}
              <div className="border-t border-gray-200 pt-6 mt-8">
                <p className="text-sm text-gray-500 text-center">
                  آخری بار اپ ڈیٹ: {new Date().toLocaleDateString('ur-PK', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-sm text-gray-400">
              <p>© 2025 ATP - آرکینم ٹائیڈ پریس۔ تمام حقوق محفوظ ہیں۔</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicyPage; 