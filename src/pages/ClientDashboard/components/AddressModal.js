import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AddressModal = ({ address, setAddress, handleSaveAddressClick, setShowAddressModal, isEditing, addressId }) => {
  const [errors, setErrors] = useState({});
  const [addressTypes, setAddressTypes] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/list-tipo-direccion/`)
      .then(response => response.json())
      .then(data => setAddressTypes(data))
      .catch(error => toast.error('Error fetching address types'));
  }, []);

  useEffect(() => {
    if (!isEditing) {
      setAddress({
        Calle: '',
        Numero: '',
        Ciudad: '',
        Estado: '',
        CodigoPostal: '',
        Pais: '',
        usuario: address.usuario,
        tipo_direccion: 1,
      });
    }
  }, [isEditing]);

  const validateFields = () => {
    const newErrors = {};
    if (!address.Calle) newErrors.Calle = 'Calle es requerida';
    if (!address.Numero) newErrors.Numero = 'Número es requerido';
    if (!address.Ciudad) newErrors.Ciudad = 'Ciudad es requerida';
    if (!address.Estado) newErrors.Estado = 'Estado es requerido';
    if (!address.CodigoPostal) newErrors.CodigoPostal = 'Código Postal es requerido';
    if (!address.Pais) newErrors.Pais = 'País es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = () => {
    if (validateFields()) {
      handleSaveAddressClick({ ...address, id: addressId });
    } else {
      toast.error('Por favor, complete todos los campos');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{isEditing ? 'Editar Dirección' : 'Nueva Dirección'}</h3>
        <div className="form-row">
          <div className="form-field">
            <label>Calle</label>
            <input
              type="text"
              value={address.Calle}
              onChange={(e) => setAddress({ ...address, Calle: e.target.value })}
            />
            {errors.Calle && <span className="error">{errors.Calle}</span>}
          </div>
          <div className="form-field">
            <label>Número</label>
            <input
              type="text"
              value={address.Numero}
              onChange={(e) => setAddress({ ...address, Numero: e.target.value })}
            />
            {errors.Numero && <span className="error">{errors.Numero}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Ciudad</label>
            <input
              type="text"
              value={address.Ciudad}
              onChange={(e) => setAddress({ ...address, Ciudad: e.target.value })}
            />
            {errors.Ciudad && <span className="error">{errors.Ciudad}</span>}
          </div>
          <div className="form-field">
            <label>Estado</label>
            <input
              type="text"
              value={address.Estado}
              onChange={(e) => setAddress({ ...address, Estado: e.target.value })}
            />
            {errors.Estado && <span className="error">{errors.Estado}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Código Postal</label>
            <input
              type="text"
              value={address.CodigoPostal}
              onChange={(e) => setAddress({ ...address, CodigoPostal: e.target.value })}
            />
            {errors.CodigoPostal && <span className="error">{errors.CodigoPostal}</span>}
          </div>
          <div className="form-field">
            <label>País</label>
            <input
              type="text"
              value={address.Pais}
              onChange={(e) => setAddress({ ...address, Pais: e.target.value })}
            />
            {errors.Pais && <span className="error">{errors.Pais}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Tipo de Dirección</label>
            <select
              value={address.tipo_direccion}
              onChange={(e) => setAddress({ ...address, tipo_direccion: e.target.value })}
            >
              {addressTypes.map(type => (
                <option key={type.id} value={type.id}>{type.nombre}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="save-button" onClick={handleSaveClick}>Guardar</button>
        <button className="cancel-button" onClick={() => setShowAddressModal(false)}>Cancelar</button>
      </div>
    </div>
  );
};

export default AddressModal;
