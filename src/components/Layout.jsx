import React from 'react';
import BottomNav from './BottomNav';

const Layout = ({ children, userData }) => {
  return (
    <div id="main-content" className="flex-grow flex flex-col">
      {children}
      <BottomNav userData={userData} />
    </div>
  );
};

export default Layout;