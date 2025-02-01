import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const UserForm = ({
  user,
  isEditing,
  setUser,
  password,
  setPassword,
  handleEditClick,
  handleSaveClick,
  handleDeleteClick,
}) => {
  const handleSave = () => {
    // Crear el objeto con los datos actualizados
    const updatedUser = {
      Nombres: user.Nombres,
      Apellidos: user.Apellidos,
      Cedula: user.Cedula,
      CorreoElectronico: user.CorreoElectronico,
      TelefonoContacto: user.TelefonoContacto,
      // Solo agregar la contraseña si se ha ingresado un valor
      ...(password && { password }),
    };

    console.log('Datos que se enviarán al backend:', JSON.stringify(updatedUser)); // Log the JSON data
    handleSaveClick(updatedUser); // Llamar a la función para guardar los cambios
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
              onChange={(e) => setUser({ ...user, Nombres: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Apellidos</label>
            <input
              type="text"
              value={user.Apellidos || ''}
              readOnly={!isEditing}
              onChange={(e) => setUser({ ...user, Apellidos: e.target.value })}
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
              onChange={(e) => setUser({ ...user, Cedula: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Teléfono</label>
            <input
              type="text"
              value={user.TelefonoContacto || ''}
              readOnly={!isEditing}
              onChange={(e) => setUser({ ...user, TelefonoContacto: e.target.value })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Email</label>
            <input
              type="email" // Cambiado a type="email" para validación automática
              value={user.CorreoElectronico || ''}
              readOnly={!isEditing}
              onChange={(e) => setUser({ ...user, CorreoElectronico: e.target.value })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Contraseña</label>
            <input
              type="password"
              value={isEditing ? password : ''} // Mostrar vacío en modo edición
              readOnly={!isEditing}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEditing ? 'Nueva contraseña' : ''} // Placeholder en modo edición
            />
          </div>
        </div>
        {isEditing ? (
          <button className="save-button" onClick={handleSave}>
            GUARDAR
          </button>
        ) : (
          <>
            <button className="edit-button" onClick={() => {
              setPassword(''); // Limpiar la contraseña al entrar en modo edición
              handleEditClick();
            }}>
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