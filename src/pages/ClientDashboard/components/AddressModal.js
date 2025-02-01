import React from 'react';

const AddressModal = ({ address, setAddress, handleSaveAddressClick, setShowAddressModal, isEditing }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEditing ? 'Editar Dirección' : 'Nueva Dirección'}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveAddressClick(address);
          }}
        >
          <div className="form-group">
            <label>Calle</label>
            <input
              type="text"
              name="Calle"
              value={address.Calle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Número</label>
            <input
              type="text"
              name="Numero"
              value={address.Numero}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Ciudad</label>
            <input
              type="text"
              name="Ciudad"
              value={address.Ciudad}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Estado</label>
            <input
              type="text"
              name="Estado"
              value={address.Estado}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Código Postal</label>
            <input
              type="text"
              name="CodigoPostal"
              value={address.CodigoPostal}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>País</label>
            <input
              type="text"
              name="Pais"
              value={address.Pais}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Tipo de Dirección</label>
            <input
              type="number"
              name="tipo_direccion"
              value={address.tipo_direccion}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="save-button">
            {isEditing ? 'Guardar Cambios' : 'Agregar Dirección'}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => setShowAddressModal(false)}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
