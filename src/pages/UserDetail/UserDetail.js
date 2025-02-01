import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaRegAddressBook, FaSignOutAlt, FaUsers, FaEdit, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UserDetail.css';
import Sidebar from './components/Sidebar';
import UserForm from './components/UserForm';
import AddressList from './components/AddressList';
import DeleteModal from './components/DeleteModal';
import AddressModal from './components/AddressModal';

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState('');
  const [direcciones, setDirecciones] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState({
    Calle: '',
    Numero: '',
    Ciudad: '',
    Estado: '',
    CodigoPostal: '',
    Pais: '',
    usuario: id,
    tipo_direccion: 1,
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressId, setAddressId] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/retrieve-user/${id}/`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Usuario no encontrado');
        }
        return response.json();
      })
      .then(data => {
        setUser(data);
        setPassword('......');
      })
      .catch(error => setError(error.message));

    fetch(`${process.env.REACT_APP_API_BASE_URL}/list-direcciones/${id}/`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener las direcciones');
        }
        return response.json();
      })
      .then(data => setDirecciones(data))
      .catch(error => setError(error.message));
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  const handleNavigateToUserList = () => {
    navigate('/list');
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

 const handleSaveClick = (updatedUser) => {
  const userData = {
    Nombres: updatedUser.Nombres,
    Apellidos: updatedUser.Apellidos,
    Cedula: updatedUser.Cedula,
    CorreoElectronico: updatedUser.CorreoElectronico,
    TelefonoContacto: updatedUser.TelefonoContacto,
    ...(updatedUser.password && { password: updatedUser.password }),
  };

  fetch(`${process.env.REACT_APP_API_BASE_URL}/update-user/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(errorData.detail || 'Error al guardar los cambios');
        });
      }
      return response.json();
    })
    .then((data) => {
      setUser(data);
      setIsEditing(false);
      toast.success('Cambios guardados correctamente');
    })
    .catch((error) => {
      console.error('Error al guardar los cambios:', error);
      toast.error(error.message || 'Error al guardar los cambios');
    });
};

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/delete-user/${id}/`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al eliminar el usuario');
        }
        toast.success('Usuario eliminado');
        navigate('/list');
      })
      .catch(error => {
        setError(error.message);
        toast.error('Error al eliminar el usuario');
      });
  };

  const handleAddAddressClick = () => {
    setAddress({
      Calle: '',
      Numero: '',
      Ciudad: '',
      Estado: '',
      CodigoPostal: '',
      Pais: '',
      usuario: id,
      tipo_direccion: 1,
    });
    setIsEditingAddress(false);
    setAddressId(null);
    setShowAddressModal(true);
  };

  const handleEditAddressClick = (direccion) => {
    setAddress(direccion);
    setAddressId(direccion.id);
    setIsEditingAddress(true);
    setShowAddressModal(true);
  };

  const handleSaveAddressClick = (updatedAddress) => {
    const url = isEditingAddress
      ? `${process.env.REACT_APP_API_BASE_URL}/update-direccion/${addressId}/`
      : `${process.env.REACT_APP_API_BASE_URL}/create-direccion/`;
    const method = isEditingAddress ? 'PUT' : 'POST';

    const addressPayload = isEditingAddress ? { ...updatedAddress, id: addressId } : updatedAddress;

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressPayload),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al guardar la dirección');
        }
        return response.json();
      })
      .then(data => {
        if (isEditingAddress) {
          setDirecciones(direcciones.map(dir => (dir.id === addressId ? data : dir)));
          toast.success('Dirección actualizada con éxito');
        } else {
          setDirecciones([...direcciones, data]);
          toast.success('Dirección guardada');
        }
        setShowAddressModal(false);
        setIsEditingAddress(false); // Reset editing state
        setAddressId(null); // Reset addressId
      })
      .catch(error => {
        setError(error.message);
        toast.error('Error al guardar la dirección');
      });
  };

  const handleDeleteAddressClick = (addressId) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/delete-direccion/${addressId}/`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al eliminar la dirección');
        }
        setDirecciones(direcciones.filter(dir => dir.id !== addressId));
        toast.success('Dirección eliminada');
      })
      .catch(error => {
        setError(error.message);
        toast.error('Error al eliminar la dirección');
      });
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="app-container">
      <ToastContainer />
      <Sidebar
        handleNavigateToDashboard={handleNavigateToDashboard}
        handleLogout={handleLogout}
      />
      <div className="detail-container">
        <div className="header">
          <h2>Detalle del Cliente</h2>
          <button className="back-button" onClick={handleNavigateToUserList}>
            VOLVER A LA LISTA DE USUARIOS
          </button>
        </div>
        <UserForm
          user={user}
          isEditing={isEditing}
          setUser={setUser}
          password={password}
          setPassword={setPassword}
          handleEditClick={handleEditClick}
          handleSaveClick={handleSaveClick}
          handleDeleteClick={handleDeleteClick}
        />
        <AddressList
          direcciones={direcciones}
          handleAddAddressClick={handleAddAddressClick}
          handleEditAddressClick={handleEditAddressClick}
          handleDeleteAddressClick={handleDeleteAddressClick}
        />
      </div>
      {showDeleteModal && (
        <DeleteModal
          confirmDelete={confirmDelete}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}
      {showAddressModal && (
        <AddressModal
          address={address}
          setAddress={setAddress}
          handleSaveAddressClick={handleSaveAddressClick}
          setShowAddressModal={setShowAddressModal}
          isEditing={isEditingAddress}
          addressId={addressId}
        />
      )}
    </div>
  );
};

export default UserDetail;