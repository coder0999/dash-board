import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import useAuth from '../hooks/useAuth'; // Import useAuth

const StorePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const { authUser } = useAuth(); // Get the authenticated user

  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!authUser) {
      setIsLoading(false);
      return;
    }
    // Fetch Products
    const productsCollection = collection(db, 'products');
    const productSnapshot = await getDocs(productsCollection);
    const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(productList);

    // Fetch Orders
    const ordersCollection = collection(db, 'orders');
    const orderSnapshot = await getDocs(ordersCollection);
    const orderList = orderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setOrders(orderList);
    setIsLoading(false);
  }, [authUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddProduct = async () => {
    if (!authUser) {
      alert('يجب تسجيل الدخول لإضافة منتج.');
      return;
    }

    if (!productName || !productPrice) {
      alert('Please fill out all fields');
      return;
    }
    try {
      const productsCollection = collection(db, 'products');
      await addDoc(productsCollection, {
        name: productName,
        price: Number(productPrice),
        createdBy: authUser.uid, // Add user's UID
      });
      // Close modal, reset fields, and refresh data
      setIsModalOpen(false);
      setProductName('');
      setProductPrice('');
      fetchData(); // Refresh both products and orders
    } catch (error) {
      console.error("Error adding document: ", error);
      alert('Failed to add product.');
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (!authUser) {
    return <div className="p-4 text-center">Please log in to see the store.</div>;
  }

  return (
    <div className="p-4 mb-16">
      <h1 className="text-2xl font-bold mb-4">المخزن</h1>
      
      {/* Product list */}
      <h2 className="text-xl font-bold mb-3 text-gray-700">المنتجات المتاحة</h2>
      <div className="space-y-3 mb-8">
        {products.length > 0 ? products.map(product => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <span className="font-semibold">{product.name}</span>
            <span className="text-gray-600">{product.price} نقاط</span>
          </div>
        )) : <p>لا توجد منتجات. أضف منتجًا جديدًا.</p>}
      </div>

      <hr className="my-6"/>

      {/* Incoming Orders */}
      <h2 className="text-xl font-bold mb-3 text-gray-700">الطلبات الواردة</h2>
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
              <h3 className="text-lg font-bold text-blue-600">{order.productName}</h3>
              <p className="text-gray-700">السعر: {order.productPrice} نقاط</p>
              <hr className="my-2" />
              <p className="text-gray-700"><strong>بيانات المستخدم:</strong></p>
              <p className="text-sm text-gray-600">Email: {order.userEmail}</p>
              <p className="text-sm text-gray-600">User ID: {order.userId}</p>
              <hr className="my-2" />
              <p className="text-gray-700"><strong>معلومات التواصل:</strong></p>
              <p className="text-sm text-gray-600">الطريقة: {order.contactMethod}</p>
              <p className="text-sm text-gray-600">الرقم: {order.phoneNumber}</p>
            </div>
          ))
        ) : (
          <p>لا توجد طلبات واردة حتى الآن.</p>
        )}
      </div>


      {/* Add Product Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 right-4 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-3xl"
      >
        +
      </button>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">إضافة منتج جديد</h2>
            <div className="space-y-4">
              <input 
                type="text"
                placeholder="اسم المنتج"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input 
                type="number"
                placeholder="السعر"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">إلغاء</button>
              <button onClick={handleAddProduct} className="bg-blue-600 text-white px-4 py-2 rounded">نشر</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorePage;