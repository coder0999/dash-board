import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import useAuth from '../hooks/useAuth'; // Import useAuth
import EditIcon from '../components/icons/EditIcon';
import TrashIcon from '../components/icons/TrashIcon';

const StorePage = () => {
  const { products, orders, addProduct, updateProduct, deleteProduct, acceptOrder, rejectOrder } = useData();
  const { authUser } = useAuth(); // Get the authenticated user
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const getStatusComponent = (status) => {
    switch (status) {
      case 'completed':
        return <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">مكتمل</span>;
      case 'rejected':
        return <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">مرفوض</span>;
      default:
        return <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">قيد الانتظar</span>;
    }
  };

  const handleAddProduct = async () => {
    if (!productName || !productPrice || !productQuantity) {
      alert('Please fill out all fields');
      return;
    }
    try {
      await addProduct({
        name: productName,
        price: Number(productPrice),
        quantity: Number(productQuantity),
      });
      setIsModalOpen(false);
      setProductName('');
      setProductPrice('');
      setProductQuantity('');
    } catch (error) {
      console.error("Error adding document: ", error);
      alert('Failed to add product.');
    }
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setNewQuantity(product.quantity);
    setNewPrice(product.price);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct || newQuantity === '' || newPrice === '') {
      return;
    }
    try {
      await updateProduct(editingProduct.id, {
        quantity: Number(newQuantity),
        price: Number(newPrice),
      });
      setIsEditModalOpen(false);
      setEditingProduct(null);
      setNewQuantity('');
      setNewPrice('');
    } catch (error) {
      console.error("Error updating document: ", error);
      alert('Failed to update product.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('هل أنت متأكد أنك تريد حذف هذا المنتج؟')) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert('Failed to delete product.');
      }
    }
  };

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
            <div className="flex items-center">
              <span className="font-semibold">{product.name}</span>
              <span className="text-gray-600 mx-4">{product.price} نقاط</span>
              <span className="text-gray-600">الكمية: {product.quantity}</span>
            </div>
            <div className="flex items-center">
              <button onClick={() => handleOpenEditModal(product)} className="p-2">
                <EditIcon className="w-6 h-6 text-gray-600" />
              </button>
              <button onClick={() => handleDeleteProduct(product.id)} className="p-2 ml-2">
                <TrashIcon className="w-6 h-6" />
              </button>
            </div>
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
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-blue-600">{order.productName}</h3>
                {getStatusComponent(order.status)}
              </div>
              <p className="text-gray-700">السعر: {order.productPrice} نقاط</p>
              <hr className="my-2" />
              <p className="text-gray-700"><strong>بيانات المستخدم:</strong></p>
              <p className="text-sm text-gray-600">Email: {order.userEmail}</p>
              <p className="text-sm text-gray-600">User ID: {order.userId}</p>
              <hr className="my-2" />
              <p className="text-gray-700"><strong>معلومات التواصل:</strong></p>
              <p className="text-sm text-gray-600">الطريقة: {order.contactMethod}</p>
              <p className="text-sm text-gray-600">الرقم: {order.phoneNumber}</p>
              
              {(!order.status || order.status === 'pending') && (
                <div className="mt-4 flex justify-end space-x-2">
                  <button onClick={() => rejectOrder(order.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                    رفض
                  </button>
                  <button onClick={() => acceptOrder(order)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                    تم
                  </button>
                </div>
              )}
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
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700">اسم المنتج</label>
                <input 
                  type="text"
                  id="productName"
                  placeholder="اسم المنتج"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                />
              </div>
              <div>
                <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">السعر</label>
                <input 
                  type="number"
                  id="productPrice"
                  placeholder="السعر"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                />
              </div>
              <div>
                <label htmlFor="productQuantity" className="block text-sm font-medium text-gray-700">الكمية</label>
                <input 
                  type="number"
                  id="productQuantity"
                  placeholder="الكمية"
                  value={productQuantity}
                  onChange={(e) => setProductQuantity(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">إلغاء</button>
              <button onClick={handleAddProduct} className="bg-blue-600 text-white px-4 py-2 rounded">نشر</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">تعديل المنتج</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">الكمية</label>
                <input 
                  type="number"
                  id="quantity"
                  placeholder="الكمية الجديدة"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">السعر</label>
                <input 
                  type="number"
                  id="price"
                  placeholder="السعر الجديد"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">إلغاء</button>
              <button onClick={handleUpdateProduct} className="bg-blue-600 text-white px-4 py-2 rounded">تحديث</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorePage;