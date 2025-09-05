import React, { useEffect, useRef } from 'react';

const QuestionCard = ({ questionData, index, onUpdate, onRemove }) => {
  const questionTextarea = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ ...questionData, [name]: value });
  };

  const handleOptionChange = (e, optionIndex) => {
    const newOptions = [...questionData.options];
    newOptions[optionIndex] = e.target.value;
    onUpdate({ ...questionData, options: newOptions });
  };

  const handleCorrectAnswerChange = (e) => {
    onUpdate({ ...questionData, correctAnswer: parseInt(e.target.dataset.index) });
  };

  const handlePointsChange = (e) => {
    onUpdate({ ...questionData, points: parseFloat(e.target.value) || 0 });
  };

  useEffect(() => {
    const autoResizeTextarea = (el) => {
      if (el) {
        el.style.height = 'auto';
        el.style.height = (el.scrollHeight) + 'px';
      }
    };
    autoResizeTextarea(questionTextarea.current);
  }, [questionData.text]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6 relative">
      <div className="question-number-box">
        <span>{index + 1}</span>
      </div>
      <div className="flex justify-end items-center mb-4">
        <div className="flex items-center space-x-2 space-x-reverse">
          <label className="block text-sm font-medium text-gray-700">النقاط:</label>
          <input 
            type="number" 
            value={questionData.points} 
            onChange={handlePointsChange}
            className="question-points w-16 p-1 border-b-2 border-gray-300 text-center bg-transparent focus:outline-none"
          />
          <button onClick={() => onRemove(questionData.id)} className="text-gray-400 hover:text-red-600 transition-colors">
            <i className="fas fa-trash fa-lg"></i>
          </button>
        </div>
      </div>
      <div className="mb-4">
        <textarea 
          ref={questionTextarea}
          name="text"
          value={questionData.text}
          onChange={handleInputChange}
          className="w-full p-2 mt-1 border-none rounded-lg focus:outline-none focus:ring-0 text-lg text-gray-800 break-words bg-transparent resize-none"
          placeholder="اكتب نص السؤال هنا..." 
          rows="2"
        ></textarea>
      </div>
      <div className="space-y-3">
        {questionData.options.map((option, optIndex) => {
          const isChecked = optIndex === questionData.correctAnswer;
          const bgColor = isChecked ? 'bg-green-100' : 'bg-gray-50';
          return (
            <div key={optIndex} className={`flex items-center space-x-2 space-x-reverse ${bgColor} p-2 rounded-lg transition-colors duration-200`}>
              <input 
                type="radio" 
                name={`correct-answer-${questionData.id}`}
                className="correct-answer-radio form-radio h-5 w-5 text-green-600 focus:ring-green-500"
                data-index={optIndex}
                checked={isChecked}
                onChange={handleCorrectAnswerChange}
              />
              <input 
                type="text" 
                value={option}
                onChange={(e) => handleOptionChange(e, optIndex)}
                className="question-option w-full p-1 border-none bg-transparent focus:outline-none focus:ring-0 text-base text-gray-700"
                placeholder={`خيار ${optIndex + 1}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;