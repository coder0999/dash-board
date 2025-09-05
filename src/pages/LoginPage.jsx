import React from 'react';

const LoginPage = ({ handleLogin }) => {
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">مرحباً بك</h1>
        <p className="text-gray-600 mb-8">الرجاء تسجيل الدخول للمتابعة</p>
        <button 
          onClick={handleLogin} 
          className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform active:scale-105 flex items-center justify-center mx-auto"
        >
          <i className="fab fa-google ml-2"></i>
          <span>تسجيل الدخول باستخدام جوجل</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
