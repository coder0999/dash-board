import { useState, useCallback } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from './useAuth';
import { useUI } from '../context/UIContext';

const useSubjects = () => {
  const { user } = useAuth();
  const { showAlert, showLoading, hideLoading } = useUI();
  const [subjects, setSubjects] = useState([]);

  const appId = 'tanya-thanawey';

  const fetchSubjects = useCallback(async () => {
    if (!user) return;
    showLoading();
    try {
      const q = query(collection(db, `artifacts/${appId}/public/data/subjects`), where("creatorId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const subjectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubjects(subjectsData);
    } catch (error) {
      console.error("Error fetching subjects: ", error);
      showAlert('حدث خطأ أثناء تحميل المواد.');
    } finally {
      hideLoading();
    }
  }, [user, showAlert, showLoading, hideLoading]);

  const addSubject = async (subjectData) => {
    if (!user) {
      showAlert('يجب عليك تسجيل الدخول لإضافة مادة.');
      return;
    }
    showLoading();
    try {
      const data = {
        ...subjectData,
        creatorId: user.uid,
        createdAt: new Date().toISOString(),
      };
      const subjectCollectionRef = collection(db, `artifacts/${appId}/public/data/subjects`);
      await addDoc(subjectCollectionRef, data);
      showAlert('تم إضافة المادة بنجاح.');
      fetchSubjects(); // Refresh the list
    } catch (error) {
      console.error("Error adding subject: ", error);
      showAlert('حدث خطأ أثناء إضافة المادة.');
    } finally {
      hideLoading();
    }
  };

  const deleteSubject = async (subjectId) => {
    showLoading();
    try {
      const subjectDocRef = doc(db, `artifacts/${appId}/public/data/subjects`, subjectId);
      await deleteDoc(subjectDocRef);
      showAlert('تم حذف المادة بنجاح.');
      fetchSubjects(); // Refresh the list
    } catch (error) {
      console.error("Error deleting subject: ", error);
      showAlert('حدث خطأ أثناء حذف المادة.');
    } finally {
      hideLoading();
    }
  };

  return { subjects, fetchSubjects, addSubject, deleteSubject };
};

export default useSubjects;