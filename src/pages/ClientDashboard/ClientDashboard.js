import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientSidebar from './components/ClientSidebar';
import UserForm from '../UserDetail/components/UserForm';
import AddressList from './components/AddressList';
import AddressModal from './components/AddressModal';
import DeleteModal from './components/DeleteModal';
import './ClientDashboard.css';

function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState('');
  const [direcciones, setDirecciones] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState({
    Calle: '',
    Numero: '',
    Ciudad: '',
    Estado: '',
    CodigoPostal: '',
    Pais: '',
    usuario: null,
    tipo_direccion: 1,
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressId, setAddressId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      fetchUserData(userId);
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const userResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/retrieve-user/${userId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (userResponse.ok) {
        const userDetails = await userResponse.json();
        setUser(userDetails);
        setAddress({ ...address, usuario: userId });
      } else {
        toast.error('Error al obtener los datos del usuario');
      }

      const addressResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/list-direcciones/${userId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (addressResponse.ok) {
        const addressData = await addressResponse.json();
        setDirecciones(addressData);
      } else {
        toast.error('Error al obtener las direcciones del usuario');
      }
    } catch (error) {
      toast.error('Error de conexión al obtener los datos del usuario');
    }
  };

  const handleEditClick = () => setIsEditing(true);

  const handleCancelEditClick = () => {
    setIsEditing(false);
    setPassword('');
  };

  const handleSaveClick = async () => {
    if (!user) return;

    try {
      const updatedUser = { ...user };
      if (password) {
        updatedUser.password = password;
      } else {
        delete updatedUser.password;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/update-user/${user.id}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (response.ok) {
        toast.success('Datos actualizados correctamente');
        handleLogout(); // Log out and redirect to login page after updating profile
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Error al actualizar los datos del usuario');
      }
    } catch (error) {
      toast.error('Error de conexión al actualizar los datos del usuario');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user_id');
    navigate('/loginusers');
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/delete-user/${user.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast.success('Perfil eliminado correctamente');
        handleLogout();
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Error al eliminar el perfil');
      }
    } catch (error) {
      toast.error('Error de conexión al eliminar el perfil');
    }
  };

  const handleAddAddressClick = () => {
    setAddress({
      Calle: '',
      Numero: '',
      Ciudad: '',
      Estado: '',
      CodigoPostal: '',
      Pais: '',
      usuario: user.id,
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

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedAddress),
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
        setIsEditingAddress(false);
        setAddressId(null);
      })
      .catch(error => {
        toast.error('Error al guardar la dirección');
      });
  };

  const handleDeleteAddressClick = (id) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/delete-direccion/${id}/`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al eliminar la dirección');
        }
        setDirecciones(direcciones.filter(dir => dir.id !== id));
        toast.success('Dirección eliminada');
      })
      .catch(error => {
        toast.error('Error al eliminar la dirección');
      });
  };

  return (
    <div className="app-container client-dashboard">
      <ToastContainer />
      <ClientSidebar 
        userEmail={user ? user.email : ''} 
        handleNavigateToDashboard={() => navigate('/dashboard')} 
        handleLogout={handleLogout} 
      />
      <div className="content-container client-dashboard">
        <div className="user-detail-container client-dashboard">
          <h1>BIENVENIDO</h1>
          {user ? (
            <>
              <UserForm
                user={user}
                isEditing={isEditing}
                setUser={setUser}
                password={password}
                setPassword={setPassword}
                handleEditClick={handleEditClick}
                handleSaveClick={handleSaveClick}
                handleDeleteClick={handleDeleteClick}
                handleCancelEditClick={handleCancelEditClick} // Add cancel edit handler
              />
              <AddressList
                direcciones={direcciones}
                handleAddAddressClick={handleAddAddressClick}
                handleEditAddressClick={handleEditAddressClick}
                handleDeleteAddressClick={handleDeleteAddressClick}
              />
            </>
          ) : (
            <p>Cargando.</p>
          )}
        </div>
      </div>
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
      <DeleteModal
        isOpen={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteUser}
      />
    </div>
  );
}

export default ClientDashboard;