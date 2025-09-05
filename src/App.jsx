import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UIProvider } from './context/UIContext';
import useAuth from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import ExamsPage from './pages/ExamsPage';
import EvaluationsPage from './pages/EvaluationsPage';
import ProfilePage from './pages/ProfilePage';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, loading, handleLogin, handleLogout } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <UIProvider>
      <BrowserRouter basename="/dash-board">
        {user ? (
          <Layout>
            <Routes>
              <Route path="/" element={<ExamsPage />} />
              <Route path="/evaluations" element={<EvaluationsPage />} />
              <Route path="/profile" element={<ProfilePage handleLogout={handleLogout} user={user} />} />
            </Routes>
          </Layout>
        ) : (
          <LoginPage handleLogin={handleLogin} />
        )}
      </BrowserRouter>
    </UIProvider>
  );
}

export default App;