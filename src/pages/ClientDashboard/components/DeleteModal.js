import React from 'react';

const DeleteModal = ({ isOpen, onRequestClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay client-dashboard">
      <div className="modal client-dashboard">
        <h2>Confirmar eliminación</h2>
        <p>¿Está seguro de que desea eliminar su perfil?</p>
        <div className="modal-buttons">
          <button onClick={onConfirm}>Sí</button>
          <button onClick={onRequestClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
