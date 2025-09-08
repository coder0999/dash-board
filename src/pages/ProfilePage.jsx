import React from 'react';
import useAuth from '../hooks/useAuth';

const ProfilePage = ({ handleLogout }) => {
  const { userData, loading } = useAuth();

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl w-full flex-grow">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">الملف الشخصي</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg">
          تسجيل الخروج
        </button>
      </div>

      {userData && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <img src={userData.photoURL} alt="صورة المستخدم" className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-300"/>
            <h2 className="text-2xl font-bold">{userData.displayName}</h2>
            <p className="text-gray-600">{userData.email}</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
