import React, { useState } from 'react';

const AddSubjectModal = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  const handleSave = () => {
    if (name.trim() === '' || link.trim() === '') {
      // You might want to show an alert here using the UI context
      return;
    }
    onSave({ name, link });
  };

  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert-box text-right">
        <h2 className="text-xl font-bold mb-4">إضافة مادة جديدة</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="subject-name-input" className="block text-sm font-medium text-gray-700 mb-2">اسم المادة</label>
            <input 
              type="text" 
              id="subject-name-input" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="subject-link-input" className="block text-sm font-medium text-gray-700 mb-2">رابط التنزيل</label>
            <input 
              type="url" 
              id="subject-link-input" 
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="https://example.com/file.pdf"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-center space-x-4 space-x-reverse">
          <button onClick={handleSave} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg">حفظ</button>
          <button onClick={onCancel} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg">إلغاء</button>
        </div>
      </div>
    </div>
  );
};

export default AddSubjectModal;