import React from 'react';

const ExamMetadata = ({ examName, setExamName, examDuration, setExamDuration, defaultPoints, setDefaultPoints }) => {
  return (
    <div id="exam-metadata-fields" className="mb-8 space-y-4">
      <div className="border-b-2 border-gray-300 pb-2">
        <label htmlFor="exam-name" className="block text-sm font-medium text-gray-700">اسم الامتحان</label>
        <input 
          type="text" 
          id="exam-name" 
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          className="mt-1 block w-full bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-lg"
        />
      </div>
      <div className="flex space-x-4 space-x-reverse">
        <div className="border-b-2 border-gray-300 pb-2 w-1/2">
          <label htmlFor="exam-duration" className="block text-sm font-medium text-gray-700">المدة الزمنية (دقيقة)</label>
          <input 
            type="number" 
            id="exam-duration" 
            value={examDuration}
            onChange={(e) => setExamDuration(e.target.value)}
            className="mt-1 block w-full bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-lg"
          />
        </div>
        <div className="border-b-2 border-gray-300 pb-2 w-1/2">
          <label htmlFor="default-points" className="block text-sm font-medium text-gray-700">النقاط الافتراضية</label>
          <input 
            type="number" 
            id="default-points" 
            value={defaultPoints}
            onChange={(e) => setDefaultPoints(e.target.value)}
            className="mt-1 block w-full bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default ExamMetadata;