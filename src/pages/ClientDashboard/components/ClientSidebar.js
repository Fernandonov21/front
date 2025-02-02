import React, { useEffect, useState } from 'react';
import { FaSignOutAlt, FaUsers } from 'react-icons/fa';

const ClientSidebar = ({ handleNavigateToDashboard, handleLogout }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Obtener el user_id del localStorage
    const userId = localStorage.getItem('user_id');
    if (userId) {
      // Llamar a la API para obtener los datos del usuario
      fetchUserData(userId);
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/retrieve-user/${userId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const userDetails = await response.json();
        // Actualizar el estado con los datos del usuario
        setUserName(userDetails.name);
        setUserEmail(userDetails.email);
      } else {
        console.error('Error fetching user data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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
          {/* Mostrar el nombre y correo del usuario */}
          <span className="profile-name">{userName}</span>
          <span className="profile-email">{userEmail}</span>
        </div>
        <button
          className="logout-button"
          onClick={() => {
            handleLogout();
            localStorage.clear();
          }}
        >
          <FaSignOutAlt className="icon" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default ClientSidebar;