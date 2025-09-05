import React from 'react';

const CustomAlert = ({ message, onOk }) => {
  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert-box">
        <p className="text-lg text-gray-700">{message}</p>
        <button onClick={onOk} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mt-4">
          موافق
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;
