import React, { useState, useEffect } from 'react';
import ExamMetadata from '../components/ExamMetadata';
import InputModeSwitcher from '../components/InputModeSwitcher';
import QuestionEditor from '../components/QuestionEditor';
import ImageUploader from '../components/ImageUploader';
import PublishedExamsList from '../components/PublishedExamsList';
import { useUI } from '../context/UIContext';
import { doc, collection, addDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';

const ExamsPage = () => {
  const { authUser: user } = useAuth();
  const { showAlert } = useUI();
  const [examName, setExamName] = useState('');
  const [examDuration, setExamDuration] = useState('');
  const [defaultPoints, setDefaultPoints] = useState(1);
  const [inputMode, setInputMode] = useState('manual');
  const [questions, setQuestions] = useState([]);
  const [currentEditingExamId, setCurrentEditingExamId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (inputMode === 'manual' && questions.length === 0) {
      setQuestions([{
        id: `q-${Date.now()}-0`,
        text: '',
        type: 'multiple-choice',
        options: ['', '', '', ''],
        correctAnswer: null,
        points: parseFloat(defaultPoints) || 1,
      }]);
    }
  }, [inputMode, questions.length, defaultPoints]);

  const resetExamForm = () => {
    setExamName('');
    setExamDuration('');
    setDefaultPoints(1);
    setQuestions([]);
    setCurrentEditingExamId(null);
  };

  const handleSaveExam = async () => {
    if (!user) {
      showAlert('يجب عليك تسجيل الدخول لحفظ الامتحان.');
      return;
    }
    const examData = {
      name: examName.trim(),
      duration: parseFloat(examDuration) || 0,
      questions: questions.map(q => {
        const { id, ...rest } = q;
        return rest;
      }),
      creatorId: user.uid,
    };
    if (!examData.name || !examData.duration || examData.questions.length === 0) {
      showAlert('الرجاء إدخال اسم الامتحان، المدة، وإضافة سؤال واحد على الأقل.');
      return;
    }
    const validQuestions = examData.questions.filter(q =>
      q.text.trim() !== '' && q.options.every(o => o.trim() !== '')
    );
    if (validQuestions.length !== examData.questions.length) {
      showAlert('الرجاء التأكد من ملء جميع حقول الأسئلة والخيارات.');
      return;
    }
    try {
      if (currentEditingExamId) {
        const examDocRef = doc(db, 'exams', currentEditingExamId);
        await updateDoc(examDocRef, examData);
        showAlert('تم تحديث الامتحان بنجاح!');
      } else {
        examData.createdAt = new Date().toISOString();
        const examsCollection = collection(db, 'exams');
        await addDoc(examsCollection, examData);
        showAlert('تم حفظ الامتحان بنجاح!');
      }
      resetExamForm();
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("فشل حفظ/تحديث الامتحان:", error);
      showAlert('حدث خطأ أثناء حفظ الامتحان.');
    }
  };

  const loadExamForEditing = async (examId) => {
    try {
      const examDocRef = doc(db, 'exams', examId);
      const docSnap = await getDoc(examDocRef);
      if (docSnap.exists()) {
        const examData = docSnap.data();
        setExamName(examData.name);
        setExamDuration(examData.duration);
        setQuestions(examData.questions.map((q, index) => ({
          ...q,
          id: `q-loaded-${Date.now()}-${index}`
        })));
        setCurrentEditingExamId(examId);
        showAlert('تم تحميل الامتحان للتعديل.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        showAlert("لم يتم العثور على الامتحان.");
      }
    } catch (error) {
      console.error("فشل تحميل الامتحان للتعديل:", error);
      showAlert('حدث خطأ أثناء تحميل الامتحان.');
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl w-full flex-grow mb-20 overflow-y-auto">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">إنشاء امتحان</h1>
      <InputModeSwitcher currentMode={inputMode} setMode={setInputMode} />
      <ExamMetadata
        examName={examName}
        setExamName={setExamName}
        examDuration={examDuration}
        setExamDuration={setExamDuration}
        defaultPoints={defaultPoints}
        setDefaultPoints={setDefaultPoints}
      />
      {inputMode === 'manual' && (
        <QuestionEditor
          questions={questions}
          setQuestions={setQuestions}
          defaultPoints={defaultPoints}
        />
      )}
      {inputMode === 'image' && (
        <ImageUploader
          onQuestionsExtracted={(extractedQuestions) => {
            setQuestions(extractedQuestions);
            setInputMode('manual');
          }}
          defaultPoints={defaultPoints}
        />
      )}
      <hr className="my-8 border-gray-300" />
      <div className="flex justify-center space-x-4 space-x-reverse">
        <button
          className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform active:scale-105"
          onClick={handleSaveExam}
        >
          {currentEditingExamId ? 'تحديث الامتحان' : 'حفظ الامتحان'}
        </button>
        {currentEditingExamId && (
          <button
            className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform active:scale-105"
            onClick={resetExamForm}
          >
            امتحان جديد
          </button>
        )}
      </div>
      <PublishedExamsList onEditExam={loadExamForEditing} refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default ExamsPage;