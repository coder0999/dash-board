import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UIProvider } from './context/UIContext';
import useAuth from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import ExamsPage from './pages/ExamsPage';
import EvaluationsPage from './pages/EvaluationsPage';
import ProfilePage from './pages/ProfilePage';
import StorePage from './pages/StorePage'; // Import the new page
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { authUser, userData, loading, handleLogin, handleLogout } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {authUser ? (
        <Layout userData={userData}>
          <Routes>
            <Route index element={<ExamsPage />} />
            <Route path="/evaluations" element={<EvaluationsPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/profile" element={<ProfilePage handleLogout={handleLogout} user={userData} />} />
          </Routes>
        </Layout>
      ) : (
        <LoginPage handleLogin={handleLogin} />
      )}
    </>
  );
}

export default App;