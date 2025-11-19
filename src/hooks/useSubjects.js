import { useState, useCallback } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from './useAuth';
import { useUI } from '../context/UIContext';

const useSubjects = () => {
  const { authUser: user, userData } = useAuth();
  const { showAlert } = useUI();
  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = useCallback(async () => {
    if (!user || !userData) return;
    try {
      let q;
      if (userData.role === 'admin') {
        // Admin sees all subjects
        q = query(collection(db, 'subjects'));
      } else {
        // Regular user sees only their own subjects
        q = query(collection(db, 'subjects'), where("creatorId", "==", user.uid));
      }
      const querySnapshot = await getDocs(q);
      const subjectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubjects(subjectsData);
    } catch (error) {
      console.error("Error fetching subjects: ", error);
      showAlert('حدث خطأ أثناء تحميل المواد.');
    }
  }, [user, userData, showAlert]);

  const addSubject = async (subjectData) => {
    if (!user) {
      showAlert('يجب عليك تسجيل الدخول لإضافة مادة.');
      return;
    }
    try {
      const data = {
        ...subjectData,
        creatorId: user.uid,
        createdAt: new Date().toISOString(),
      };
      const subjectCollectionRef = collection(db, 'subjects');
      await addDoc(subjectCollectionRef, data);
      showAlert('تم إضافة المادة بنجاح.');
      fetchSubjects(); // Refresh the list
    } catch (error) {
      console.error("Error adding subject: ", error);
      showAlert('حدث خطأ أثناء إضافة المادة.');
    }
  };

  const deleteSubject = async (subjectId) => {
    try {
      const subjectDocRef = doc(db, 'subjects', subjectId);
      await deleteDoc(subjectDocRef);
      showAlert('تم حذف المادة بنجاح.');
      fetchSubjects(); // Refresh the list
    } catch (error) {
      console.error("Error deleting subject: ", error);
      showAlert('حدث خطأ أثناء حذف المادة.');
    }
  };

  return { subjects, fetchSubjects, addSubject, deleteSubject };
};

export default useSubjects;
