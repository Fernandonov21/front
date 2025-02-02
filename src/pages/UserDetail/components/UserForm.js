import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserForm = ({
  user,
  isEditing,
  setUser,
  password,
  setPassword,
  handleEditClick,
  handleSaveClick,
  handleDeleteClick,
  handleCancelEditClick,
}) => {
  const [originalUser, setOriginalUser] = useState(user);

  useEffect(() => {
    if (!isEditing) {
      setOriginalUser(user);
    }
  }, [user, isEditing]);

  const handleSave = () => {
    // Validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const nameRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;

    if (!emailRegex.test(user.CorreoElectronico)) {
      toast.error('El formato de correo electrónico es incorrecto o ya existe');
      return;
    }

    if (!phoneRegex.test(user.TelefonoContacto)) {
      toast.error('El teléfono debe tener 10 dígitos numéricos');
      return;
    }

    if (!phoneRegex.test(user.Cedula)) {
      toast.error('La cédula debe tener 10 dígitos numéricos');
      return;
    }

    if (!nameRegex.test(user.Nombres) || !nameRegex.test(user.Apellidos)) {
      toast.error('El nombre y apellido no deben contener números o caracteres especiales');
      return;
    }

    // Crear el objeto con los datos actualizados
    const updatedUser = {
      Nombres: user.Nombres,
      Apellidos: user.Apellidos,
      Cedula: user.Cedula,
      CorreoElectronico: user.CorreoElectronico,
      TelefonoContacto: user.TelefonoContacto,
      ...(password && { password }),
    };

    console.log('Datos que se enviarán al backend:', JSON.stringify(updatedUser));
    handleSaveClick(updatedUser);
  };

  const handleInputChange = (e, field) => {
    let value = e.target.value;
    if (field === 'Cedula' || field === 'TelefonoContacto') {
      if (value.length > 10) return;
      if (!/^\d*$/.test(value)) return;
    } else if (field === 'Nombres' || field === 'Apellidos') {
      value = value.toUpperCase();
      if (!/^[A-ZÑÁÉÍÓÚ\s]*$/.test(value)) return;
    }
    setUser({ ...user, [field]: value });
  };

  const handleCancel = () => {
    setUser(originalUser);
    setPassword('');
    handleCancelEditClick();
  };

  const handleEdit = () => {
    setOriginalUser(user);
    setPassword('');
    handleEditClick();
  };

  return (
    <div className="user-detail-container">
      <div className="user-detail">
        <div className="form-row">
          <div className="form-field">
            <label>Nombres</label>
            <input
              type="text"
              value={user.Nombres || ''}
              readOnly={!isEditing}
              onChange={(e) => handleInputChange(e, 'Nombres')}
            />
          </div>
          <div className="form-field">
            <label>Apellidos</label>
            <input
              type="text"
              value={user.Apellidos || ''}
              readOnly={!isEditing}
              onChange={(e) => handleInputChange(e, 'Apellidos')}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Cédula</label>
            <input
              type="text"
              value={user.Cedula || ''}
              readOnly={!isEditing}
              onChange={(e) => handleInputChange(e, 'Cedula')}
            />
          </div>
          <div className="form-field">
            <label>Teléfono</label>
            <input
              type="text"
              value={user.TelefonoContacto || ''}
              readOnly={!isEditing}
              onChange={(e) => handleInputChange(e, 'TelefonoContacto')}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              value={user.CorreoElectronico || ''}
              readOnly={!isEditing}
              onChange={(e) => handleInputChange(e, 'CorreoElectronico')}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Contraseña</label>
            <input
              type="password"
              value={isEditing ? password : ''}
              readOnly={!isEditing}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEditing ? 'Nueva contraseña' : ''}
            />
          </div>
        </div>
        {isEditing ? (
          <>
            <button className="save-button" onClick={handleSave}>
              GUARDAR
            </button>
            <button className="cancel-button" onClick={handleCancel}>
              CANCELAR
            </button>
          </>
        ) : (
          <>
            <button className="edit-button" onClick={handleEdit}>
              <FaEdit /> EDITAR
            </button>
            <button className="delete-button" onClick={handleDeleteClick}>
              <FaTrash /> ELIMINAR
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserForm;