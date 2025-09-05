import React from 'react';

const InputModeSwitcher = ({ currentMode, setMode }) => {
  const getButtonClass = (mode) => {
    const baseClasses = 'font-bold py-2 px-6 rounded-lg transition-colors';
    return currentMode === mode
      ? `${baseClasses} bg-blue-600 text-white`
      : `${baseClasses} bg-gray-300 text-gray-800`;
  };

  return (
    <div className="flex justify-center mb-8 space-x-4 space-x-reverse">
      <button onClick={() => setMode('manual')} className={getButtonClass('manual')}>
        رفع يدوي
      </button>
      <button onClick={() => setMode('image')} className={getButtonClass('image')}>
        رفع بالصور
      </button>
    </div>
  );
};

export default InputModeSwitcher;