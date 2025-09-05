import React from 'react';

const SubjectCard = ({ subject, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center space-y-4 hover:shadow-lg transition-shadow relative">
      <button onClick={() => onDelete(subject.id)} className="absolute top-2 left-2 text-gray-400 hover:text-red-600 transition-colors">
        <i className="fas fa-times fa-lg"></i>
      </button>
      <h3 className="text-xl font-bold text-gray-800 text-center pt-4">{subject.name}</h3>
      <a href={subject.link || '#'} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 space-x-reverse no-underline">
        <i className="fas fa-download"></i>
        <span>تنزيل</span>
      </a>
    </div>
  );
};

export default SubjectCard;