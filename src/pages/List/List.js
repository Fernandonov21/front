import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegAddressBook, FaSignOutAlt, FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './List.css';

const List = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [addresses, setAddresses] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/list-users/`)
      .then(response => response.json())
      .then(data => setUsers(data.filter(user => user.CorreoElectronico !== 'admin@admin.com')))
      .catch(error => setError(error.message));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  const toggleAddresses = (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
    } else {
      setExpandedUserId(userId);
      if (!addresses[userId]) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/list-direcciones/${userId}/`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al obtener las direcciones');
            }
            return response.json();
          })
          .then(data => setAddresses(prev => ({ ...prev, [userId]: data })))
          .catch(error => setError(error.message));
      }
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user => user.Cedula.includes(searchTerm));

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-menu">
          <button className="sidebar-menu-item" onClick={handleNavigateToDashboard}>
            <FaRegAddressBook className="icon" />
            <span>Registro</span>
          </button>
          <button className="sidebar-menu-item selected">
            <FaUsers className="icon" />
            <span>Usuarios</span>
          </button>
        </div>
        <div className="sidebar-profile">
          <div className="profile-info">
            <span className="profile-name">Admin</span>
            <span className="profile-email">admin@email.com</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt className="icon" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
      <div className="list-container">
        <h2>Lista de Usuarios</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Buscar por cédula"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <table className="user-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Cédula</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <React.Fragment key={user.id}>
                <tr className="user-row" onClick={() => handleUserClick(user.id)}>
                  <td>{user.Nombres} {user.Apellidos}</td>
                  <td>{user.CorreoElectronico}</td>
                  <td>{user.TelefonoContacto}</td>
                  <td>{user.Cedula}</td>
                  <td>
                    <button className="toggle-button" onClick={(e) => { e.stopPropagation(); toggleAddresses(user.id); }}>
                      {expandedUserId === user.id ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </td>
                </tr>
                {expandedUserId === user.id && (
                  <tr className="address-row">
                    <td colSpan="5">
                      <div className="addresses">
                        <h4>Direcciones:</h4>
                        <ul>
                          {addresses[user.id] ? (
                            addresses[user.id].map((address, index) => (
                              <li key={index}>
                                {address.Calle}, {address.Numero}, {address.Ciudad}, {address.Estado}, {address.CodigoPostal}, {address.Pais}
                              </li>
                            ))
                          ) : (
                            <li>Cargando direcciones...</li>
                          )}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;