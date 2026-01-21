import { useState, useCallback } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from './useAuth';
import { useUI } from '../context/UIContext';

const useSubjects = () => {
  const { authUser: user, userData } = useAuth();
  const { showAlert } = useUI();
  const [subjects, setSubjects] = useState([]);

  const CLOUDINARY_CLOUD_NAME = "dvh42xxbd";
  const CLOUDINARY_UPLOAD_PRESET = "PDFs652";

  const fetchSubjects = useCallback(async () => {
    if (!user || !userData) return;
    try {
      let q;
      if (userData.role === 'admin') {
        q = query(collection(db, 'subjects'));
      } else {
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

  const addSubject = async ({ name, file }) => {
    if (!user) {
      showAlert('يجب عليك تسجيل الدخول لإضافة تقييم.');
      return;
    }
    if (!file) {
      showAlert('الرجاء اختيار ملف للتحميل.');
      return;
    }

    showAlert('بدأ التحميل...', 'info');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const data = await response.json();
      const originalUrl = data.secure_url;
      // Insert fl_attachment to force download
      const downloadURL = originalUrl.replace('/upload/', '/upload/fl_attachment/');

      showAlert('اكتمل تحميل الملف. الآن يتم الحفظ...', 'success');

      const firestoreData = {
        name: name,
        link: downloadURL,
        creatorId: user.uid,
        createdAt: new Date().toISOString(),
        fileName: file.name
      };

      await addDoc(collection(db, 'subjects'), firestoreData);
      showAlert('تم إضافة التقييم بنجاح.', 'success');
      fetchSubjects();

    } catch (error) {
      console.error("Upload error: ", error);
      showAlert(`حدث خطأ أثناء الرفع: ${error.message}`, 'error');
    }
  };

  const deleteSubject = async (subjectId) => {
    try {
      const subjectDocRef = doc(db, 'subjects', subjectId);
      await deleteDoc(subjectDocRef);
      showAlert('تم حذف المادة بنجاح.');
      fetchSubjects(); // Refresh the list
    } catch (error)
      {
      console.error("Error deleting subject: ", error);
      showAlert('حدث خطأ أثناء حذف المادة.');
    }
  };

  return { subjects, fetchSubjects, addSubject, deleteSubject };
};

export default useSubjects;