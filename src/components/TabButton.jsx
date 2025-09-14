import React from 'react';

const TabButton = ({ title, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`py-2 px-4 text-lg font-medium transition-colors 
      ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
    {title}
  </button>
);

export default TabButton;
