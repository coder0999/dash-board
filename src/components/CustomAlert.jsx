import React, { useEffect } from 'react';

const CustomAlert = ({ message, onOk, type = 'info' }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onOk();
    }, 3000); // Auto-dismiss after 3 seconds
    return () => clearTimeout(timer);
  }, [onOk]);

  let bgColor = 'bg-blue-500';
  let textColor = 'text-white';
  let borderColor = 'border-blue-700';

  if (type === 'success') {
    bgColor = 'bg-green-500';
    borderColor = 'border-green-700';
  } else if (type === 'error') {
    bgColor = 'bg-red-500';
    borderColor = 'border-red-700';
  } else if (type === 'info') {
    bgColor = 'bg-blue-500';
    borderColor = 'border-blue-700';
  }

  // Adjusting for a white and blue theme for the default alert (info)
  // I will make the background white and the text/border blue
  bgColor = 'bg-white';
  textColor = 'text-blue-700'; // Darker blue for text
  borderColor = 'border-blue-500'; // Medium blue for border

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${bgColor} ${textColor} border-t-4 ${borderColor} rounded-b px-4 py-3 shadow-md`} role="alert">
        <div className="flex items-center">
          <div className="py-1">
            <svg className="fill-current h-6 w-6 text-blue-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg>
          </div>
          <div>
            <p className="font-bold text-lg">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
