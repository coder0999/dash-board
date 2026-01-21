import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, orderBy, updateDoc, runTransaction } from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { authUser } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Effect to setup listeners when user logs in
  useEffect(() => {
    if (!authUser) return; // Do nothing if no user

    setLoading(true);

    const subjectQuery = query(collection(db, 'subjects'), where("creatorId", "==", authUser.uid));
    const productsQuery = query(collection(db, 'products'));
    const ordersQuery = query(collection(db, 'orders'), orderBy("createdAt", "asc"));
    const examsQuery = query(collection(db, 'exams'), where("creatorId", "==", authUser.uid));

    const unsubSubjects = onSnapshot(subjectQuery, snapshot => {
      setSubjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubProducts = onSnapshot(productsQuery, snapshot => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubOrders = onSnapshot(ordersQuery, snapshot => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubExams = onSnapshot(examsQuery, snapshot => {
      setExams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    setLoading(false);

    // Cleanup: unsubscribe from all listeners when user logs out or component unmounts
    return () => {
      unsubSubjects();
      unsubProducts();
      unsubOrders();
      unsubExams();
    };
  }, [authUser]);

  // Effect to clear data when user logs out
  useEffect(() => {
    if (!authUser) {
      setSubjects([]);
      setProducts([]);
      setOrders([]);
      setExams([]);
    }
  }, [authUser]);

  const addSubject = async (subjectData) => {
    if (!authUser) return;
    try {
      const data = { ...subjectData, creatorId: authUser.uid, createdAt: new Date().toISOString() };
      await addDoc(collection(db, 'subjects'), data);
    } catch (error) {
      console.error("Error adding subject: ", error);
      throw error;
    }
  };

  const deleteSubject = async (subjectId) => {
    if (!authUser) return;
    try {
      await deleteDoc(doc(db, 'subjects', subjectId));
    } catch (error) {
      console.error("Error deleting subject: ", error);
      throw error;
    }
  };

  const addProduct = async (productData) => {
    if (!authUser) return;
    try {
      const data = {
        ...productData,
        createdBy: authUser.uid,
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'products'), data);
    } catch (error) {
      console.error("Error adding product: ", error);
      throw error;
    }
  };

  const deleteProduct = async (productId) => {
    if (!authUser) return;
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      console.error("Error deleting product: ", error);
      throw error;
    }
  }

  const updateProduct = async (productId, productData) => {
    if (!authUser) return;
    try {
      await updateDoc(doc(db, 'products', productId), productData);
    } catch (error) {
      console.error("Error updating product: ", error);
      throw error;
    }
  }

  const deleteExam = async (examId) => {
    if (!authUser) return;
    try {
      await deleteDoc(doc(db, 'exams', examId));
    } catch (error) {
      console.error("Error deleting exam: ", error);
      throw error;
    }
  };

  const deleteOrder = async (orderId) => {
    if (!authUser) return;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (error) {
      console.error("Error deleting order: ", error);
      throw error;
    }
  };

  const rejectOrder = async (orderId) => {
    if (!authUser) return;
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'rejected'
      });
    } catch (error) {
      console.error("Error rejecting order: ", error);
      throw error;
    }
  };

  const acceptOrder = async (order) => {
    if (!authUser) return;
    try {
        await runTransaction(db, async (transaction) => {
            const orderRef = doc(db, 'orders', order.id);
            const userRef = doc(db, 'users', order.userId);

            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) {
                throw new Error("User document not found!");
            }

            const currentPoints = userDoc.data().points || 0;
            if (currentPoints < order.productPrice) {
                // We will update the status to rejected if not enough points
                transaction.update(orderRef, { status: 'rejected', rejectionReason: 'Not enough points' });
                return;
            }
            
            const newPoints = currentPoints - order.productPrice;

            // Update user's points
            transaction.update(userRef, { points: newPoints });

            // Update order status
            transaction.update(orderRef, { status: 'completed' });
        });
    } catch (error) {
        console.error("Error accepting order: ", error);
        // If the transaction fails, we might want to update the order to reflect the error
        await updateDoc(doc(db, 'orders', order.id), { status: 'failed', failureReason: error.message });
        throw error;
    }
  };


  const value = { subjects, products, orders, exams, loading, addSubject, deleteSubject, addProduct, deleteExam, deleteOrder, updateProduct, deleteProduct, acceptOrder, rejectOrder };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};