import React from 'react';

const DeleteModal = ({ confirmDelete, setShowDeleteModal }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Confirmar Eliminación</h3>
        <p>¿Estás seguro de que deseas eliminar este cliente?</p>
        <button className="confirm-button" onClick={confirmDelete}>Confirmar</button>
        <button className="cancel-button" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
      </div>
    </div>
  );
};

export default DeleteModal;
