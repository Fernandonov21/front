import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginClients.css';
import loginImage from '../../assets/4eec348b-2483-40f5-82e9-c8001076c92e.svg';

function LoginClients({ onLogin }) {
  const [CorreoElectronico, setCorreoElectronico] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // State to control success message
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [cedula, setCedula] = useState('');
  const [telefono, setTelefono] = useState('');
  const [registerError, setRegisterError] = useState('');
  const navigate = useNavigate();

  const handleNameChange = (setter) => (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-ZÑÁÉÍÓÚÜ\s]/g, ''); // Allow 'Ñ' and accented characters
    setter(value);
  };

  const handleNumericChange = (setter) => (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 10) {
      setter(value);
    }
  };

  const validateCedula = (cedula) => {
    if (cedula.length !== 10) return false;
  
    const digito_region = cedula.substring(0, 2);
    if (digito_region < 1 || digito_region > 24) return false;
  
    const ultimo_digito = parseInt(cedula.substring(9, 10));
    const pares = parseInt(cedula.substring(1, 2)) + parseInt(cedula.substring(3, 4)) + parseInt(cedula.substring(5, 6)) + parseInt(cedula.substring(7, 8));
  
    const calculateImpar = (num) => {
      num = num * 2;
      return num > 9 ? num - 9 : num;
    };
  
    const impares = calculateImpar(parseInt(cedula.substring(0, 1))) +
                    calculateImpar(parseInt(cedula.substring(2, 3))) +
                    calculateImpar(parseInt(cedula.substring(4, 5))) +
                    calculateImpar(parseInt(cedula.substring(6, 7))) +
                    calculateImpar(parseInt(cedula.substring(8, 9)));
  
    const suma_total = pares + impares;
    const primer_digito_suma = parseInt(String(suma_total).substring(0, 1));
    const decena = (primer_digito_suma + 1) * 10;
    let digito_validador = decena - suma_total;
  
    if (digito_validador === 10) digito_validador = 0;
  
    return digito_validador === ultimo_digito;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("API Base URL:", process.env.REACT_APP_API_BASE_URL);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/nonstaff-login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ CorreoElectronico, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('user_id', data.user_id);
        setSuccess('Inicio de sesión exitoso'); // Set success message
        toast.success('Inicio de sesión exitoso', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            backgroundColor: '#4caf50',
            color: '#ffffff',
            fontWeight: 'bold',
          },
          icon: '🚀',
        });
        navigate('/clientdashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Login failed');
      }
    } catch (error) {
      setError('Failed to fetch');
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setRegisterError('');
    if (!nombres || !apellidos || !cedula || !CorreoElectronico || !telefono || !password) {
      setRegisterError('Todos los campos son obligatorios');
      return;
    }
    if (!validateCedula(cedula)) {
      setRegisterError('Cédula incorrecta');
      return;
    }
    if (telefono.length !== 10) {
      setRegisterError('Formato de teléfono incompleto. Debe tener exactamente 10 dígitos');
      return;
    }

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
          CorreoElectronico: CorreoElectronico,
          password: password,
          TelefonoContacto: telefono,
        }),
      });

      if (response.ok) {
        toast.dismiss();
        toast.success('Usuario creado exitosamente');
        setShowModal(false);
        setNombres('');
        setApellidos('');
        setCedula('');
        setCorreoElectronico('');
        setTelefono('');
        setPassword('');
      } else {
        const errorData = await response.json();
        if (errorData.Cedula) {
          setRegisterError('La cédula ya está registrada');
        } else if (errorData.CorreoElectronico) {
          setRegisterError('El correo electrónico ya está registrado');
        } else {
          setRegisterError(errorData.detail || 'Error al crear el usuario');
        }
      }
    } catch (error) {
      setRegisterError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="login-container unique-login">
      <div className="inner-container">
        <div className="container secondary">
          <form onSubmit={handleSubmit} className="login-form">
            <h2>Sign in</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>} {/* Display success message */}
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico:</label>
              <input
                id="email"
                type="email"
                placeholder="user@gmail.com"
                value={CorreoElectronico}
                onChange={(e) => setCorreoElectronico(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="login-button">Login</button>
            <button type="button" className="register-button" onClick={() => setShowModal(true)}>Regístrate</button>
          </form>
        </div>
        <div className="image">
          <img src={loginImage} alt="Login Illustration" />
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="modal-close" onClick={() => setShowModal(false)}>&times;</span>
            <h2 className="modal-title">Registro de Usuario</h2>
            <form onSubmit={handleRegister}>
              <div className="form-row">
                <div className="modal-form-group">
                  <label htmlFor="nombres">Nombres:</label>
                  <input
                    id="nombres"
                    type="text"
                    placeholder="Nombres"
                    value={nombres}
                    onChange={handleNameChange(setNombres)}
                  />
                </div>
                <div className="modal-form-group">
                  <label htmlFor="apellidos">Apellidos:</label>
                  <input
                    id="apellidos"
                    type="text"
                    placeholder="Apellidos"
                    value={apellidos}
                    onChange={handleNameChange(setApellidos)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="modal-form-group">
                  <label htmlFor="cedula">Cédula:</label>
                  <input
                    id="cedula"
                    type="text"
                    placeholder="Cédula"
                    value={cedula}
                    onChange={handleNumericChange(setCedula)}
                  />
                </div>
                <div className="modal-form-group">
                  <label htmlFor="telefono">Teléfono:</label>
                  <input
                    id="telefono"
                    type="text"
                    placeholder="Teléfono"
                    value={telefono}
                    onChange={handleNumericChange(setTelefono)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="modal-form-group">
                  <label htmlFor="register-email">Correo Electrónico:</label>
                  <input
                    id="register-email"
                    type="email"
                    placeholder="user@gmail.com"
                    value={CorreoElectronico}
                    onChange={(e) => setCorreoElectronico(e.target.value)}
                  />
                </div>
                <div className="modal-form-group">
                  <label htmlFor="register-password">Password:</label>
                  <input
                    id="register-password"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="modal-register-button">Registrar</button>
              {registerError && <p className="modal-error">{registerError}</p>}
            </form>
          </div>
        </div>
      )}
      <ToastContainer transition={Slide} />
    </div>
  );
}

export default LoginClients;