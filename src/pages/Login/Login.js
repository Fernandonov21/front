import React, { useState } from 'react';
import './Login.css';
import loginImage from '../../assets/4eec348b-2483-40f5-82e9-c8001076c92e.svg'; // Corrected import path

function Login({ onLogin }) {
  const [CorreoElectronico, setCorreoElectronico] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // New state for success message

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("API Base URL:", process.env.REACT_APP_API_BASE_URL); // Depuración
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ CorreoElectronico, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access);
        setSuccess('Login successful!'); // Set success message
        setError(''); // Clear any previous error
        onLogin();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Login failed');
        setSuccess(''); // Clear any previous success message
      }
    } catch (error) {
      setError('Failed to fetch');
      setSuccess(''); // Clear any previous success message
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
          </form>
        </div>
        <div className="image">
          <img src={loginImage} alt="Login Illustration" />
        </div>
      </div>
    </div>
  );
}

export default Login;