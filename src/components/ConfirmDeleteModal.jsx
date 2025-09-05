import React from 'react';

const ConfirmDeleteModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert-box">
        <p className="text-lg text-gray-700">{message}</p>
        <div className="mt-6 flex justify-center space-x-4 space-x-reverse">
          <button onClick={onConfirm} className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg">نعم, حذف</button>
          <button onClick={onCancel} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg">إلغاء</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;