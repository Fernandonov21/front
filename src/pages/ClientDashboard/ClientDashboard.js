import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Sidebar from '../UserDetail/components/Sidebar'; // Importa el componente Sidebar
import UserForm from '../UserDetail/components/UserForm'; // Importa el componente UserForm
import './ClientDashboard.css'; // Importa el archivo CSS para estilos
import { useNavigate } from 'react-router-dom'; // Importa useNavigate de react-router-dom
import { toast, ToastContainer } from 'react-toastify'; // Importa toast para notificaciones
import 'react-toastify/dist/ReactToastify.css'; // Importa estilos de toast
import Modal from 'react-modal'; // Importa Modal de react-modal

const AddressModal = ({ address, setAddress, handleSaveAddressClick, setShowAddressModal, isEditing, addressId }) => {
  const [errors, setErrors] = useState({});
  const [addressTypes, setAddressTypes] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/list-tipo-direccion/`)
      .then(response => response.json())
      .then(data => setAddressTypes(data))
      .catch(error => toast.error('Error fetching address types'));
  }, []);

  useEffect(() => {
    if (!isEditing) {
      setAddress({
        Calle: '',
        Numero: '',
        Ciudad: '',
        Estado: '',
        CodigoPostal: '',
        Pais: '',
        usuario: address.usuario,
        tipo_direccion: 1,
      });
    }
  }, [isEditing]);

  const validateFields = () => {
    const newErrors = {};
    if (!address.Calle) newErrors.Calle = 'Calle es requerida';
    if (!address.Numero) newErrors.Numero = 'Número es requerido';
    if (!address.Ciudad) newErrors.Ciudad = 'Ciudad es requerida';
    if (!address.Estado) newErrors.Estado = 'Estado es requerido';
    if (!address.CodigoPostal) newErrors.CodigoPostal = 'Código Postal es requerido';
    if (!address.Pais) newErrors.Pais = 'País es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = () => {
    if (validateFields()) {
      handleSaveAddressClick({ ...address, id: addressId });
    } else {
      toast.error('Por favor, complete todos los campos');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{isEditing ? 'Editar Dirección' : 'Nueva Dirección'}</h3>
        <div className="form-row">
          <div className="form-field">
            <label>Calle</label>
            <input
              type="text"
              value={address.Calle}
              onChange={(e) => setAddress({ ...address, Calle: e.target.value })}
            />
            {errors.Calle && <span className="error">{errors.Calle}</span>}
          </div>
          <div className="form-field">
            <label>Número</label>
            <input
              type="text"
              value={address.Numero}
              onChange={(e) => setAddress({ ...address, Numero: e.target.value })}
            />
            {errors.Numero && <span className="error">{errors.Numero}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Ciudad</label>
            <input
              type="text"
              value={address.Ciudad}
              onChange={(e) => setAddress({ ...address, Ciudad: e.target.value })}
            />
            {errors.Ciudad && <span className="error">{errors.Ciudad}</span>}
          </div>
          <div className="form-field">
            <label>Estado</label>
            <input
              type="text"
              value={address.Estado}
              onChange={(e) => setAddress({ ...address, Estado: e.target.value })}
            />
            {errors.Estado && <span className="error">{errors.Estado}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Código Postal</label>
            <input
              type="text"
              value={address.CodigoPostal}
              onChange={(e) => setAddress({ ...address, CodigoPostal: e.target.value })}
            />
            {errors.CodigoPostal && <span className="error">{errors.CodigoPostal}</span>}
          </div>
          <div className="form-field">
            <label>País</label>
            <input
              type="text"
              value={address.Pais}
              onChange={(e) => setAddress({ ...address, Pais: e.target.value })}
            />
            {errors.Pais && <span className="error">{errors.Pais}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Tipo de Dirección</label>
            <select
              value={address.tipo_direccion}
              onChange={(e) => setAddress({ ...address, tipo_direccion: e.target.value })}
            >
              {addressTypes.map(type => (
                <option key={type.id} value={type.id}>{type.nombre}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="save-button" onClick={handleSaveClick}>Guardar</button>
        <button className="cancel-button" onClick={() => setShowAddressModal(false)}>Cancelar</button>
      </div>
    </div>
  );
};

const DeleteModal = ({ isOpen, onRequestClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Confirmar eliminación</h2>
        <p>¿Está seguro de que desea eliminar su perfil?</p>
        <button onClick={onConfirm}>Sí</button>
        <button onClick={onRequestClose}>No</button>
      </div>
    </div>
  );
};

Modal.setAppElement('#root'); // Set the app element for accessibility

function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState('');
  const [direcciones, setDirecciones] = useState([]); // Estado para las direcciones
  const [showAddressModal, setShowAddressModal] = useState(false); // Estado para mostrar el modal
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
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Estado para mostrar el modal de eliminación
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  // Función para obtener los datos del usuario y sus direcciones
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
        console.log(userDetails); // Verifica los datos del usuario en la consola
        setUser(userDetails); // Actualiza el estado con los datos del usuario
        setAddress({ ...address, usuario: userId }); // Set user ID in address state
      } else {
        console.error('Error al obtener los datos del usuario');
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
        setDirecciones(addressData); // Actualiza el estado con las direcciones del usuario
      } else {
        console.error('Error al obtener las direcciones del usuario');
        toast.error('Error al obtener las direcciones del usuario');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      toast.error('Error de conexión al obtener los datos del usuario');
    }
  };

  // Obtener los datos del usuario y sus direcciones al cargar el componente
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      fetchUserData(userId); // Obtén los datos del usuario y sus direcciones usando el user_id
    }
  }, []);

  // Función para manejar la edición
  const handleEditClick = () => setIsEditing(true);

  // Función para guardar los cambios
  const handleSaveClick = async () => {
    if (!user) return;

    try {
      const updatedUser = { ...user };

      // Solo actualizar la contraseña si el usuario la cambió
      if (password) {
        updatedUser.password = password;
      } else {
        delete updatedUser.password;
      }

      console.log('Datos que se enviarán al backend:', JSON.stringify(updatedUser)); // Log the JSON data

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
        const updatedUserData = await response.json();
        setUser(updatedUserData); // Actualiza el estado con los nuevos datos
        localStorage.setItem('user', JSON.stringify(updatedUserData)); // Actualiza el localStorage
        setIsEditing(false); // Salir del modo de edición
        setPassword(''); // Reset password display
        toast.success('Datos actualizados correctamente');
      } else {
        const errorData = await response.json();
        console.error('Error al actualizar los datos del usuario:', errorData);
        toast.error(errorData.detail || 'Error al actualizar los datos del usuario');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      toast.error('Error de conexión al actualizar los datos del usuario');
    }
  };

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user_id');
    navigate('/loginclients'); // Redirige al login
  };

  // Función para manejar la eliminación del usuario
  const handleDeleteClick = () => {
    setShowDeleteModal(true); // Mostrar el modal de confirmación
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
        handleLogout(); // Redirige al login después de eliminar el perfil
      } else {
        const errorData = await response.json();
        console.error('Error al eliminar el perfil:', errorData);
        toast.error(errorData.detail || 'Error al eliminar el perfil');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      toast.error('Error de conexión al eliminar el perfil');
    }
  };

  // Componente AddressList integrado
  const AddressList = ({ direcciones, handleAddAddressClick, handleEditAddressClick, handleDeleteAddressClick }) => {
    const [addressTypes, setAddressTypes] = useState([]);

    useEffect(() => {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/list-tipo-direccion/`)
        .then(response => response.json())
        .then(data => setAddressTypes(data))
        .catch(error => toast.error('Error fetching address types'));
    }, []);

    const getAddressTypeName = (id) => {
      const type = addressTypes.find(type => type.id === id);
      return type ? type.nombre : 'Desconocido';
    };

    return (
      <div className="direcciones-container">
        <h2>Direcciones</h2>
        <button className="add-direccion-button" onClick={handleAddAddressClick}>
          + NUEVA DIRECCIÓN
        </button>
        <table className="direcciones-table">
          <thead>
            <tr>
              <th>TIPO DE DIRECCIÓN</th>
              <th>CALLE</th>
              <th>CIUDAD</th>
              <th>PROVINCIA/ESTADO</th>
              <th>CODIGO POSTAL</th>
              <th>PAIS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {direcciones.map((direccion, index) => (
              <tr key={index}>
                <td>{getAddressTypeName(direccion.tipo_direccion)}</td>
                <td>{direccion.Calle}</td>
                <td>{direccion.Ciudad}</td>
                <td>{direccion.Estado}</td>
                <td>{direccion.CodigoPostal}</td>
                <td>{direccion.Pais}</td>
                <td>
                  <button className="action-button" onClick={() => handleEditAddressClick(direccion)}><FaEdit /></button>
                  <button className="action-button" onClick={() => handleDeleteAddressClick(direccion.id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Funciones para manejar las direcciones
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
      <ToastContainer /> {/* Contenedor para las notificaciones */}
      <Sidebar handleNavigateToDashboard={() => navigate('/dashboard')} handleLogout={handleLogout} />
      <div className="content-container client-dashboard">
        <div className="user-detail-container client-dashboard">
          <h1>Hola Cliente</h1>
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
                handleDeleteClick={handleDeleteClick} // Implementar la función de eliminación
              />
              <AddressList
                direcciones={direcciones} // Pasa las direcciones como prop
                handleAddAddressClick={handleAddAddressClick}
                handleEditAddressClick={handleEditAddressClick}
                handleDeleteAddressClick={handleDeleteAddressClick}
              />
            </>
          ) : (
            <p>No se pudo obtener la información del usuario.</p>
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