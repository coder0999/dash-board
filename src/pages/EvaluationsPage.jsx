import React, { useState, useEffect } from 'react';
import useSubjects from '../hooks/useSubjects';
import SubjectCard from '../components/SubjectCard';
import AddSubjectModal from '../components/AddSubjectModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const EvaluationsPage = () => {
  const { subjects, fetchSubjects, addSubject, deleteSubject } = useSubjects();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleAddSubject = async (subjectData) => {
    await addSubject(subjectData);
    setAddModalOpen(false);
  };

  const handleDelete = (subjectId) => {
    setSubjectToDelete(subjectId);
  };

  const confirmDelete = async () => {
    if (!subjectToDelete) return;
    await deleteSubject(subjectToDelete);
    setSubjectToDelete(null);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl w-full flex-grow mb-20 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">التقييمات</h1>
        <button onClick={() => setAddModalOpen(true)} className="bg-blue-600 text-white text-2xl w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-transform transform active:scale-105">
          <i className="fas fa-plus"></i>
        </button>
      </div>
      <div id="subjects-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.length > 0 ? (
          subjects.map(subject => (
            <SubjectCard key={subject.id} subject={subject} onDelete={handleDelete} />
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">لم يتم إضافة أي مواد بعد.</p>
        )}
      </div>
      {isAddModalOpen && (
        <AddSubjectModal 
          onSave={handleAddSubject} 
          onCancel={() => setAddModalOpen(false)} 
        />
      )}
      {subjectToDelete && (
        <ConfirmDeleteModal
          message="هل أنت متأكد أنك تريد حذف هذه المادة؟ لا يمكن التراجع عن هذا الإجراء."
          onConfirm={confirmDelete}
          onCancel={() => setSubjectToDelete(null)}
        />
      )}
    </div>
  );
};

export default EvaluationsPage;
