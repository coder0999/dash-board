import React, { useState } from 'react';

const AddSubjectModal = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    if (name.trim() === '' || !file) {
      // You might want to show an alert here using the UI context
      return;
    }
    onSave({ name, file });
  };

  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert-box text-right">
        <h2 className="text-xl font-bold mb-4">إضافة تقييم جديد</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="subject-name-input" className="block text-sm font-medium text-gray-700 mb-2">اسم التقييم</label>
            <input 
              type="text" 
              id="subject-name-input" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="subject-file-input" className="block text-sm font-medium text-gray-700 mb-2">ملف التقييم</label>
            <input 
              type="file" 
              id="subject-file-input" 
              onChange={handleFileChange}
              className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" 
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