import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegAddressBook, FaHome, FaArrowRight, FaSignOutAlt, FaUsers } from 'react-icons/fa';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css'; // Asegúrate de importar tus estilos CSS

const App = () => {
  const navigate = useNavigate();
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [cedula, setCedula] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogout = () => {
    // Lógica para manejar el logout
    localStorage.removeItem('token'); // Eliminar el token del local storage
    navigate('/login'); // Redirigir a la página de login
  };

  const handleCedulaChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setCedula(value);
    } else if (value.length > 10) {
      toast.dismiss();
      toast.error('La cédula debe tener 10 dígitos numéricos');
    }
  };

  const handleTelefonoChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setTelefono(value);
    } else if (value.length > 10) {
      toast.dismiss();
      toast.error('El teléfono debe tener 10 dígitos numéricos');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors

    // Validar campos vacíos
    if (!nombres || !apellidos || !cedula || !correoElectronico || !telefono || !password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    console.log("API URL:", process.env.REACT_APP_API_BASE_URL); // Depuración

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/create-user/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Nombres: nombres,
          Apellidos: apellidos,
          Cedula: cedula,
          CorreoElectronico: correoElectronico,
          password: password,
          TelefonoContacto: telefono,
        }),
      });

      if (response.ok) {
        toast.dismiss();
        toast.success('Usuario creado exitosamente');
        // Limpiar el formulario
        setNombres('');
        setApellidos('');
        setCedula('');
        setCorreoElectronico('');
        setTelefono('');
        setPassword('');
      } else {
        const errorData = await response.json();
        if (errorData.Cedula) {
          setError('La cédula ya está registrada');
        } else if (errorData.CorreoElectronico) {
          setError('El correo electrónico ya está registrado');
        } else {
          setError(errorData.detail || 'Error al crear el usuario');
        }
      }
    } catch (error) {
      setError('Error al conectar con el servidor');
    }
  };

  const handleFetchUsers = () => {
    navigate('/list');
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-menu">
          <button className="sidebar-menu-item selected">
            <FaRegAddressBook className="icon" />
            <span>Registro</span>
          </button>
          <button className="sidebar-menu-item" onClick={handleFetchUsers}>
            <FaUsers className="icon" />
            <span>Usuarios</span>
          </button>
        </div>

        {/* Sección de perfil y botón de logout */}
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

      <div className="form-container">
        <h2>Nuevo Cliente</h2>
        <div className="form">
          <form onSubmit={handleSubmit}>
            {/* Fila para Nombres y Apellidos */}
            <div className="form-row">
              <div className="form-field">
                <label>Nombres</label>
                <input
                  type="text"
                  placeholder="Nombres"
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Apellidos</label>
                <input
                  type="text"
                  placeholder="Apellidos"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                />
              </div>
            </div>

            {/* Fila para Cédula y Teléfono */}
            <div className="form-row">
              <div className="form-field">
                <label>Cédula</label>
                <input
                  type="text"
                  placeholder="Cédula"
                  value={cedula}
                  onChange={handleCedulaChange}
                />
              </div>
              <div className="form-field">
                <label>Teléfono</label>
                <input
                  type="text"
                  placeholder="Teléfono"
                  value={telefono}
                  onChange={handleTelefonoChange}
                />
              </div>
            </div>

            {/* Fila para Email y Password */}
            <div className="form-row">
              <div className="form-field">
                <label>Email</label>
                <input
                  type="text"
                  placeholder="Email"
                  value={correoElectronico}
                  onChange={(e) => setCorreoElectronico(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Botón de Guardar */}
            <button type="submit" className="save-button">
              GUARDAR <FaArrowRight className="icon" />
            </button>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </div>
      <ToastContainer transition={Slide} />
    </div>
  );
};

export default App;