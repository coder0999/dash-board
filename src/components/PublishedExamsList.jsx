import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import { useUI } from '../context/UIContext';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const CopyIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`feather feather-copy ${className}`}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const EditIcon = ({ className }) => (
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 106.86 122.88" style={{ enableBackground: 'new 0 0 106.86 122.88' }} xmlSpace="preserve" className={className}>
    <style type="text/css">{`.st0{fill-rule:evenodd;clip-rule:evenodd;}`}</style>
    <g>
      <path className="st0" d="M39.62,64.58c-1.46,0-2.64-1.41-2.64-3.14c0-1.74,1.18-3.14,2.64-3.14h34.89c1.46,0,2.64,1.41,2.64,3.14 c0,1.74-1.18,3.14-2.64,3.14H39.62L39.62,64.58z M46.77,116.58c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15H7.33 c-2.02,0-3.85-0.82-5.18-2.15C0.82,119.4,0,117.57,0,115.55V7.33c0-2.02,0.82-3.85,2.15-5.18C3.48,0.82,5.31,0,7.33,0h90.02 c2.02,0,3.85,0.83,5.18,2.15c1.33,1.33,2.15,3.16,2.15,5.18v50.14c0,1.74-1.41,3.15-3.15,3.15c-1.74,0-3.15-1.41-3.15-3.15V7.33 c0-0.28-0.12-0.54-0.31-0.72c-0.19-0.19-0.44-0.31-0.72-0.31H7.33c-0.28,0-0.54,0.12-0.73,0.3C6.42,6.8,6.3,7.05,6.3,7.33v108.21 c0,0.28,0.12,0.54,0.3,0.72c0.19,0.19,0.45,0.31,0.73,0.31H46.77L46.77,116.58z M98.7,74.34c-0.51-0.49-1.1-0.72-1.78-0.71 c-0.68,0.01-1.26,0.27-1.74,0.78l-3.91,4.07l10.97,10.59l3.95-4.11c0.47-0.48,0.67-1.1,0.66-1.78c-0.01-0.67-0.25-1.28-0.73-1.74 L98.7,74.34L98.7,74.34z M78.21,114.01c-1.45,0.46-2.89,0.94-4.33,1.41c-1.45,0.48-2.89,0.97-4.33,1.45 c-3.41,1.12-5.32,1.74-5.72,1.85c-0.39,0.12-0.16-1.48,0.7-4.81l2.71-10.45l0,0l20.55-21.38l10.96,10.55L78.21,114.01L78.21,114.01 z M39.62,86.95c-1.46,0-2.65-1.43-2.65-3.19c0-1.76,1.19-3.19,2.65-3.19h17.19c1.46,0,2.65,1.43,2.65,3.19 c0,1.76-1.19,3.19-2.65,3.19H39.62L39.62,86.95z M39.62,42.26c-1.46,0-2.64-1.41-2.64-3.14c0-1.74,1.18-3.14,2.64-3.14h34.89 c1.46,0,2.64,1.41,2.64,3.14c0,1.74-1.18,3.14-2.64,3.14H39.62L39.62,42.26z M24.48,79.46c2.06,0,3.72,1.67,3.72,3.72 c0,2.06-1.67,3.72-3.72,3.72c-2.06,0-3.72-1.67-3.72-3.72C20.76,81.13,22.43,79.46,24.48,79.46L24.48,79.46z M24.48,57.44 c2.06,0,3.72,1.67,3.72,3.72c0,2.06-1.67,3.72-3.72,3.72c-2.06,0-3.72-1.67-3.72-3.72C20.76,59.11,22.43,57.44,24.48,57.44 L24.48,57.44z M24.48,35.42c2.06,0,3.72,1.67,3.72,3.72c0,2.06-1.67,3.72-3.72,3.72c-2.06,0-3.72-1.67-3.72-3.72 C20.76,37.08,22.43,35.42,24.48,35.42L24.48,35.42z" />
    </g>
  </svg>
);

const StatisticsIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M2,21H22V19H2V21M5,17H8V10H5V17M10.5,17H13.5V7H10.5V17M16,17H19V13H16V17Z" />
  </svg>
);

const TrashIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor" className={className}>
      <path d="M844.8 326.4c-19.2 0-38.4 19.2-38.4 38.4v550.4c0 19.2-19.2 38.4-38.4 38.4H256c-19.2 0-38.4-19.2-38.4-38.4V364.8c0-19.2-12.8-38.4-38.4-38.4-19.2 0-38.4 19.2-38.4 38.4v550.4c6.4 57.6 51.2 108.8 115.2 108.8h512c64 0 115.2-51.2 115.2-115.2V364.8c0-19.2-19.2-38.4-38.4-38.4z m-409.6 435.2V364.8c0-19.2-12.8-38.4-38.4-38.4-19.2 0-38.4 19.2-38.4 38.4V768c0 19.2 12.8 38.4 38.4 38.4 25.6-6.4 38.4-19.2 38.4-44.8z m224 0V364.8c0-19.2-19.2-38.4-38.4-38.4s-38.4 19.2-38.4 38.4V768c0 19.2 19.2 38.4 38.4 38.4 19.2-6.4 38.4-19.2 38.4-44.8z m326.4-582.4h-179.2V108.8c0-57.6-51.2-108.8-108.8-108.8H326.4c-64 0-108.8 44.8-108.8 108.8v76.8H38.4c-19.2-6.4-38.4 12.8-38.4 32s19.2 32 38.4 32h947.2c19.2 0 38.4-12.8 38.4-32s-19.2-38.4-38.4-38.4z m-256 0H288V108.8c0-19.2 19.2-38.4 38.4-38.4h371.2c19.2 0 32 12.8 32 38.4v70.4z m0 0" />
    </svg>
  );

const PublishedExamsList = ({ onEditExam, refreshTrigger }) => {
  const { authUser: user } = useAuth();
  const { showAlert } = useUI();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [examToDelete, setExamToDelete] = useState(null);
  const [copiedExamId, setCopiedExamId] = useState(null);

  const handleCopyLink = (examId) => {
    const link = `https://coder0999.github.io/basic/#/exam/${examId}`;
    navigator.clipboard.writeText(link).then(() => {
        setCopiedExamId(examId);
        setTimeout(() => setCopiedExamId(null), 2000); // Reset after 2 seconds
    }, (err) => {
        console.error('Could not copy text: ', err);
        showAlert('فشل نسخ الرابط.');
    });
  };

  const fetchExams = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // All logged-in users should see all exams.
      const q = query(collection(db, 'exams'));
      const querySnapshot = await getDocs(q);
      const examsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExams(examsData);
    } catch (error) {
      console.error("Error fetching exams: ", error);
      showAlert('حدث خطأ أثناء تحميل الامتحانات.');
    } finally {
      setLoading(false);
    }
  }, [user, showAlert]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams, refreshTrigger]);

  const handleDelete = (examId) => {
    setExamToDelete(examId);
  };

  const confirmDelete = async () => {
    if (!examToDelete) return;
    try {
      const examDocRef = doc(db, 'exams', examToDelete);
      await deleteDoc(examDocRef);
      showAlert('تم حذف الامتحان بنجاح.');
      setExamToDelete(null);
      fetchExams(); // Refresh the list
    } catch (error) {
      console.error("Error deleting exam: ", error);
      showAlert('حدث خطأ أثناء حذف الامتحان.');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8"><div className="spinner"></div></div>;
  }

  return (
    <div id="published-exams-section" className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">امتحاناتك المنشورة</h2>
        <button id="published-exams-list-refresh-btn" onClick={fetchExams} className="text-gray-500 hover:text-blue-600">
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>
      <div id="published-exams-list" className="space-y-4">
        {exams.length === 0 ? (
          <p className="text-center text-gray-600">لا توجد امتحانات منشورة حتى الآن.</p>
        ) : (
          exams.map((exam) => (
            <div key={exam.id} className="bg-white p-4 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{exam.name}</h3>
                <p className="text-gray-600">المدة: {exam.duration} دقيقة | عدد الأسئلة: {exam.questions.length}</p>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse">
                <button onClick={() => onEditExam(exam.id)} className="flex flex-col items-center text-gray-500 hover:text-indigo-600 transition-colors">
                  <EditIcon className="w-6 h-6" />
                  <span className="text-sm font-medium">تعديل</span>
                </button>
                <button onClick={() => handleCopyLink(exam.id)} className="flex flex-col items-center text-gray-500 hover:text-green-600 transition-colors">
                  <CopyIcon className="w-6 h-6" />
                  <span className="text-sm font-medium">{copiedExamId === exam.id ? 'تم النسخ!' : 'نسخ'}</span>
                </button>
                <Link to={`/exams/${exam.id}/results`} className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition-colors">
                  <StatisticsIcon className="w-6 h-6" />
                  <span className="text-sm font-medium">إحصائيات</span>
                </Link>
                <button onClick={() => handleDelete(exam.id)} className="flex flex-col items-center text-red-500 hover:text-red-700 transition-colors">
                  <TrashIcon className="w-6 h-6" />
                  <span className="text-sm font-medium">حذف</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {examToDelete && (
        <ConfirmDeleteModal
          message="هل أنت متأكد أنك تريد حذف هذا الامتحان؟ لا يمكن التراجع عن هذا الإجراء."
          onConfirm={confirmDelete}
          onCancel={() => setExamToDelete(null)}
        />
      )}
    </div>
  );
};

export default PublishedExamsList;
