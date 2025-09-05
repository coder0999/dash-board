import React from 'react';
import QuestionCard from './QuestionCard';

const QuestionEditor = ({ questions, setQuestions, defaultPoints }) => {

  const addQuestion = () => {
    const newQuestion = {
      id: `q-${Date.now()}`,
      text: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: null,
      points: parseFloat(defaultPoints) || 1,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (updatedQuestion) => {
    setQuestions(questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
  };

  const removeQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  return (
    <div id="manual-content" className="space-y-6">
      <div id="question-list">
        {questions.map((q, index) => (
          <QuestionCard 
            key={q.id} 
            questionData={q} 
            index={index} 
            onUpdate={updateQuestion} 
            onRemove={removeQuestion} 
          />
        ))}
      </div>
      <div className="flex justify-center space-x-4 space-x-reverse mt-8">
        <button 
          id="add-question-btn" 
          onClick={addQuestion}
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform active:scale-105"
        >
          أضف سؤال جديد يدوياً
        </button>
      </div>
    </div>
  );
};

export default QuestionEditor;