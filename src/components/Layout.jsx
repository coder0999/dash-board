import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout = ({ children, userData }) => {
  const location = useLocation();

  // Hide the bottom nav on the results page
  const showBottomNav = !location.pathname.includes('/results');

  return (
    <div id="main-content" className="flex-grow flex flex-col">
      {children}
      {showBottomNav && <BottomNav userData={userData} />}
    </div>
  );
};

export default Layout;
