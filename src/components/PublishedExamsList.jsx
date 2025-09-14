import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import { useUI } from '../context/UIContext';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const PublishedExamsList = ({ onEditExam, refreshTrigger }) => {
  const { authUser: user } = useAuth();
  const { showAlert } = useUI();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [examToDelete, setExamToDelete] = useState(null);

  const fetchExams = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'exams'), where("creatorId", "==", user.uid));
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
              <div className="flex space-x-2 space-x-reverse">
                <button onClick={() => onEditExam(exam.id)} className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors">
                  عرض/تعديل
                </button>
                <Link to={`/exams/${exam.id}/results`} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                  إحصائيات
                </Link>
                <button onClick={() => handleDelete(exam.id)} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                  حذف
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