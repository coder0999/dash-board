import React from 'react';

const ProfilePage = ({ handleLogout, user }) => {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl w-full flex-grow mb-20 overflow-y-auto">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">الملف الشخصي</h1>
      <div className="flex flex-col items-center justify-center space-y-6">
        <img src={user.photoURL} alt="صورة المستخدم" className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg" />
        <h2 className="text-2xl font-bold text-gray-800">{user.displayName}</h2>
        <button onClick={handleLogout} className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform active:scale-105">
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
