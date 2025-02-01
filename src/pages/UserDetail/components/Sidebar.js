import React from 'react';
import { FaSignOutAlt, FaUsers } from 'react-icons/fa';

const Sidebar = ({ handleNavigateToDashboard, handleLogout }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-menu">
          <button className="sidebar-menu-item selected">
            <FaUsers className="icon" />
            <span>Usuarios</span>
          </button>
        </div>
      </div>
      <div className="sidebar-profile">
        <div className="profile-info">
          <span className="profile-name">Admin</span>
          <span className="profile-email">admin@email.com</span>
        </div>
        <button className="logout-button" onClick={() => {
          handleLogout();
          localStorage.clear();
        }}>
          <FaSignOutAlt className="icon" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
