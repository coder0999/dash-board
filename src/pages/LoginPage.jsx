import React from 'react';

// --- Feature Card Component ---
const FeatureCard = ({ icon, title, children }) => (
  <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg text-gray-800 text-center h-full">
    <div className="flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full mb-4 mx-auto shadow-md">
      <i className={`fas ${icon} text-2xl`}></i>
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-sm text-gray-700">{children}</p>
  </div>
);

// --- SVG Icon Components ---
const FloatingIcon1 = ({ className, style }) => (
  <svg className={className} style={style} fill="currentColor" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path d="M927 631.2c-19.3 0-35 15.7-35 35V733H254.5V130.8h127c19.3 0 35-15.7 35-35s-15.7-35-35-35h-162c-19.3 0-35 15.7-35 35V221H97c-19.3 0-35 15.7-35 35v672.1c0 19.3 15.7 35 35 35h707.5c19.3 0 35-15.7 35-35V802.9H927c19.3 0 35-15.7 35-35V666.2c0-19.4-15.7-35-35-35z m-157.5 262H132V291.1h52.5v476.8c0 19.3 15.7 35 35 35h550v90.3z" />
    <path d="M458.8 571.8c55.1 55.1 128.4 85.5 206.3 85.5s151.2-30.4 206.3-85.5c55.1-55.1 85.5-128.4 85.5-206.3s-30.4-151.2-85.5-206.3c-55-55.2-128.3-85.5-206.2-85.5S513.9 104 458.8 159.1c-55.1 55.1-85.5 128.4-85.5 206.3s30.4 151.3 85.5 206.4z m206.4-428.1c122.3 0 221.8 99.5 221.8 221.8s-99.5 221.8-221.8-221.8c-122.3 0-221.8-99.5-221.8-221.8s99.5-221.8 221.8-221.8z" />
    <path d="M624.6 451.3c6.8 6.8 15.8 10.3 24.7 10.3s17.9-3.4 24.7-10.3l123.7-123.7c13.7-13.7 13.7-35.8 0-49.5-13.7-13.7-35.8-13.7-49.5 0l-99 99-46.2-46.4c-13.7-13.7-35.8-13.7-49.5 0-13.7 13.7-13.7 35.8 0 49.5l71.1 71.1z" />
  </svg>
);

const FloatingIcon2 = ({ className, style }) => (
  <svg className={className} style={style} fill="currentColor" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 432.59" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="nonzero" d="M216.29 0c119.46 0 216.3 96.84 216.3 216.29 0 119.46-96.84 216.3-216.3 216.3C96.84 432.59 0 335.75 0 216.29 0 96.84 96.84 0 216.29 0z" opacity="0.1"/>
    <path fill-rule="nonzero" d="M216.29.16c59.68 0 113.72 24.19 152.83 63.31 39.11 39.11 63.31 93.15 63.31 152.82 0 59.68-24.2 113.72-63.31 152.83-39.11 39.11-93.15 63.31-152.83 63.31-59.67 0-113.71-24.2-152.83-63.31C24.35 330.01.16 275.97.16 216.29c0-59.67 24.19-113.71 63.3-152.82C102.58 24.35 156.62.16 216.29.16zm133.98 82.16c-34.28-34.28-81.66-55.49-133.98-55.49-52.32 0-99.69 21.21-133.97 55.49s-55.49 81.65-55.49 133.97c0 52.32 21.21 99.7 55.49 133.98 34.28 34.28 81.65 55.49 133.97 55.49 52.32 0 99.7-21.21 133.98-55.49 34.28-34.28 55.49-81.66 55.49-133.98 0-52.32-21.21-99.69-55.49-133.97z"/>
    <path fill-rule="nonzero" d="M233.19 221.15c-12.64 7.35-23.79-11.73-11.22-19.13l147.32-88.03 12.81-39.93a10.79 10.79 0 0 1 1.93-3.6c.86-1.07 1.92-1.98 3.1-2.66l75.58-43.65c2.66-1.54 5.69-1.85 8.44-1.12 2.73.74 5.21 2.53 6.75 5.19a11.15 11.15 0 0 1 1.42 4.19c.17 1.41.06 2.85-.3 4.22l-6.25 31.73 31.87 11.48c2.9 1.03 5.09 3.15 6.3 5.72 1.21 2.56 1.44 5.6.4 8.48-.43 1.21-1.06 2.31-1.81 3.23l.42.63-79.08 45.66c-1.42.82-2.99 1.29-4.55 1.44-1.62.14-3.24-.06-4.73-.59l-41.18-11.23-147.22 87.97z"/>
  </svg>
);

const FloatingIcon3 = ({ className, style }) => (
  <svg className={className} style={style} fill="currentColor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 122.88" xml:space="preserve">
    <style type="text/css">{`.st0{fill-rule:evenodd;clip-rule:evenodd;}`}</style>
    <g><path className="st0" d="M14.1,0h94.67c7.76,0,14.1,6.35,14.1,14.1v94.67c0,7.75-6.35,14.1-14.1,14.1H14.1c-7.75,0-14.1-6.34-14.1-14.1 V14.1C0,6.34,6.34,0,14.1,0L14.1,0z M81.35,28.38L94.1,41.14c1.68,1.68,1.68,4.44,0,6.11l-7.06,7.06L68.17,35.44l7.06-7.06 C76.91,26.7,79.66,26.7,81.35,28.38L81.35,28.38z M52.34,88.98c-5.1,1.58-10.21,3.15-15.32,4.74c-12.01,3.71-11.95,6.18-8.68-5.37 l5.16-18.2l0,0l-0.02-0.02L64.6,39.01l18.87,18.87l-31.1,31.11L52.34,88.98L52.34,88.98z M36.73,73.36l12.39,12.39 c-3.35,1.03-6.71,2.06-10.07,3.11c-7.88,2.42-7.84,4.05-5.7-3.54L36.73,73.36L36.73,73.36z"/></g>
  </svg>
);

// --- Main Login Page Component ---
const LoginPage = ({ handleLogin }) => {
  return (
    <div className="login-geometric-background flex-grow flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
      <div className="shape-container">
        {/* Geometric Shapes */}
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>

        {/* Floating Thematic SVG Icons (Final Adjustments) */}
        <FloatingIcon1 className="floating-icon" style={{ width: '80px', height: '80px', top: '12%', right: '15%', transform: 'rotate(15deg)' }} />
        <FloatingIcon2 className="floating-icon" style={{ width: '80px', height: '68px', top: '10%', left: '10%', transform: 'rotate(-10deg)' }} />
        <FloatingIcon3 className="floating-icon" style={{ width: '64px', height: '64px', top: '25% ', left: '48%', transform: 'rotate(5deg)' }} />
      </div>
      
      <div className="w-full max-w-5xl text-center z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">أهلاً بك في لوحة التحكم</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10">
          منصة متكاملة لإدارة وإنشاء الاختبارات الإلكترونية بسهولة وكفاءة
        </p>

        <button 
          onClick={handleLogin} 
          className="bg-blue-600 text-white font-bold py-4 px-10 rounded-full shadow-xl transition-transform transform hover:scale-105 active:scale-95 flex items-center justify-center mx-auto text-lg mb-16"
        >
          <i className="fab fa-google mr-3"></i>
          <span>تسجيل الدخول للبدء</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard icon="fa-chart-pie" title="تحليل النتائج">
            اعرض إحصائيات مفصلة لنتائج الطلاب لفهم أدائهم بشكل أفضل.
          </FeatureCard>
          <FeatureCard icon="fa-link" title="مشاركة سهلة">
            انسخ رابط مباشر للامتحان وشاركه بسهولة مع طلابك عبر أي منصة.
          </FeatureCard>
          <FeatureCard icon="fa-image" title="امتحانات بالصور">
            أضف صورًا للأسئلة لإثراء المحتوى. <span className="block mt-2 text-xs font-bold text-blue-600">(تحت التطوير)</span>
          </FeatureCard>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;