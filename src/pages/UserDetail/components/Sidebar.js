import React from 'react';
import { FaSignOutAlt, FaUsers, FaRegAddressBook } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ handleNavigateToDashboard, handleLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isUserDetailPage = location.pathname.startsWith('/user');

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-menu">
          <button className="sidebar-menu-item" onClick={() => navigate('/dashboard')}>
            <FaRegAddressBook className="icon" />
            <span>Registro</span>
          </button>
          <button className={`sidebar-menu-item ${isUserDetailPage ? 'selected' : ''}`}>
            <FaUsers className="icon" />
            <span>Usuarios</span>
          </button>
        </div>
      </div>
      <div className="sidebar-profile">
        <div className="profile-info">
          <span className="profile-name">Admin</span>
          <span className="profile-email">admin@admin.com</span>
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
