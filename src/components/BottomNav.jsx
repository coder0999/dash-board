import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = ({ userData }) => { // Accept userData prop
  const getLinkClass = ({ isActive }) => {
    const baseClasses = 'flex flex-col items-center focus:outline-none p-2';
    return isActive
      ? `${baseClasses} text-blue-600 font-bold`
      : `${baseClasses} text-gray-500`;
  };

  

  return (
    <nav id="bottom-nav" className="fixed bottom-0 left-0 w-full bg-white shadow-2xl z-10">
      <div className="flex justify-around items-center h-16">
        <NavLink to="/" className={getLinkClass}>
          <i className="fas fa-clipboard-list nav-icon"></i>
          <span className="text-xs mt-1">الامتحانات</span>
        </NavLink>
        <NavLink to="/evaluations" className={getLinkClass}>
          <i className="fas fa-chart-bar nav-icon"></i>
          <span className="text-xs mt-1">التقييمات</span>
        </NavLink>
        <NavLink to="/store" className={getLinkClass}>
          <i className="fas fa-store nav-icon"></i>
          <span className="text-xs mt-1">المخزن</span>
        </NavLink>
        
        <NavLink to="/profile" className={getLinkClass}>
          <i className="fas fa-user nav-icon"></i>
          <span className="text-xs mt-1">الملف الشخصي</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
