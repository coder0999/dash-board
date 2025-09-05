import React from 'react';
import BottomNav from './BottomNav';

const Layout = ({ children }) => {
  return (
    <div id="main-content" className="flex-grow flex flex-col">
      {children}
      <BottomNav />
    </div>
  );
};

export default Layout;