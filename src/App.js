import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login/Login'; // Corrected import path
import LoginClients from './Clients/LoginClients/LoginClients'; // Import LoginClients component
import Dashboard from './pages/Dashboard/Dashboard';
import List from './pages/List/List'; // Import List component
import UserDetail from './pages/UserDetail/UserDetail'; // Import UserDetail component
import HelloClient from './pages/HelloClient/HelloClient'; // Import HelloClient component
import ClientDashboard from './pages/ClientDashboard/ClientDashboard'; // Import ClientDashboard component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false); // Set loading to false after checking token
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login'); // Ensure redirection to login page
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while checking authentication
  }

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/loginclients" element={<LoginClients onLogin={handleLogin} />} /> {/* Add route for LoginClients component */}
      <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} />} />
      <Route path="/list" element={<List />} /> {/* Add route for List component */}
      <Route path="/user/:id" element={<UserDetail />} /> {/* Add route for UserDetail component */}
      <Route path="/helloclient" element={<HelloClient />} /> {/* Add route for HelloClient component */}
      <Route path="/clientdashboard" element={<ClientDashboard />} /> {/* Add route for ClientDashboard component */}
      {/* ...other routes... */}
    </Routes>
  );
}

export default App;
