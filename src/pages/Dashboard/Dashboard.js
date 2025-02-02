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

      if (value.length === 10) {
        const digito_region = value.substring(0, 2);
        if (digito_region >= 1 && digito_region <= 24) {
          const ultimo_digito = value.substring(9, 10);
          const pares = parseInt(value.substring(1, 2)) + parseInt(value.substring(3, 4)) + parseInt(value.substring(5, 6)) + parseInt(value.substring(7, 8));
          let numero1 = value.substring(0, 1) * 2;
          if (numero1 > 9) numero1 -= 9;
          let numero3 = value.substring(2, 3) * 2;
          if (numero3 > 9) numero3 -= 9;
          let numero5 = value.substring(4, 5) * 2;
          if (numero5 > 9) numero5 -= 9;
          let numero7 = value.substring(6, 7) * 2;
          if (numero7 > 9) numero7 -= 9;
          let numero9 = value.substring(8, 9) * 2;
          if (numero9 > 9) numero9 -= 9;
          const impares = numero1 + numero3 + numero5 + numero7 + numero9;
          const suma_total = pares + impares;
          const primer_digito_suma = String(suma_total).substring(0, 1);
          const decena = (parseInt(primer_digito_suma) + 1) * 10;
          let digito_validador = decena - suma_total;
          if (digito_validador === 10) digito_validador = 0;

          if (digito_validador !== parseInt(ultimo_digito)) {
            toast.dismiss();
            toast.error('La cédula es incorrecta');
          }
        } else {
          toast.dismiss();
          toast.error('Esta cédula no pertenece a ninguna región');
        }
      }
    }
  };

  const handleTelefonoChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setTelefono(value);
    }
  };

  const handleNombresChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-ZÑÁÉÍÓÚÜ\s]*$/.test(value)) {
      setNombres(value);
    } else {
      toast.dismiss();
      toast.error('Los nombres no deben contener números');
    }
  };

  const handleApellidosChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-ZÑÁÉÍÓÚÜ\s]*$/.test(value)) {
      setApellidos(value);
    } else {
      toast.dismiss();
      toast.error('Los apellidos no deben contener números');
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

    // Validar longitud de cédula y teléfono
    if (cedula.length !== 10) {
      setError('La cédula debe tener 10 dígitos numéricos');
      return;
    }

    if (telefono.length !== 10) {
      setError('El teléfono debe tener 10 dígitos numéricos');
      return;
    }

    // Convertir nombres y apellidos a mayúsculas
    const nombresUpper = nombres.toUpperCase();
    const apellidosUpper = apellidos.toUpperCase();

    console.log("API URL:", process.env.REACT_APP_API_BASE_URL); // Depuración

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/create-user/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Nombres: nombresUpper,
          Apellidos: apellidosUpper,
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
          setError('Correo electrónico no es válido o ya está registrado');
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
            <span className="profile-email">admin@admin.com</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt className="icon" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>

      <div className="form-container">
        <h2>Nuevo Registro</h2>
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
                  onChange={handleNombresChange}
                />
              </div>
              <div className="form-field">
                <label>Apellidos</label>
                <input
                  type="text"
                  placeholder="Apellidos"
                  value={apellidos}
                  onChange={handleApellidosChange}
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