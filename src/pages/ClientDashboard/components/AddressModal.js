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
    if (!address.Calle) {
      newErrors.Calle = 'Calle es requerida';
    } else if (!/^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/.test(address.Calle)) {
      newErrors.Calle = 'Calle solo puede contener letras, números, ñ y tildes';
    }
    if (!address.Numero) {
      newErrors.Numero = 'Número es requerido';
    } else if (!/^\d+$/.test(address.Numero)) {
      newErrors.Numero = 'Número solo puede contener dígitos numéricos';
    }
    if (!address.Ciudad) newErrors.Ciudad = 'Ciudad es requerida';
    if (!address.Estado) newErrors.Estado = 'Estado es requerido';
    if (!address.CodigoPostal) {
      newErrors.CodigoPostal = 'Código Postal es requerido';
    } else if (!/^\d{6}$/.test(address.CodigoPostal)) {
      newErrors.CodigoPostal = 'Código Postal debe ser de 6 dígitos numéricos';
    }
    if (!address.Pais) newErrors.Pais = 'País es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = () => {
    if (validateFields()) {
      handleSaveAddressClick({ ...address, id: addressId });
    } else {
      toast.error('Por favor, complete todos los campos correctamente');
    }
  };

  const handleInputChange = (field, value) => {
    setAddress({ ...address, [field]: value.toUpperCase() });
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
              onChange={(e) => handleInputChange('Calle', e.target.value)}
              onKeyPress={(e) => {
                if (!/[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            {errors.Calle && <span className="error">{errors.Calle}</span>}
          </div>
          <div className="form-field">
            <label>Número</label>
            <input
              type="text"
              value={address.Numero}
              onChange={(e) => handleInputChange('Numero', e.target.value)}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
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
              onChange={(e) => handleInputChange('Ciudad', e.target.value)}
              onKeyPress={(e) => {
                if (!/[a-zA-Z\s]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            {errors.Ciudad && <span className="error">{errors.Ciudad}</span>}
          </div>
          <div className="form-field">
            <label>Estado</label>
            <input
              type="text"
              value={address.Estado}
              onChange={(e) => handleInputChange('Estado', e.target.value)}
              onKeyPress={(e) => {
                if (!/[a-zA-Z\s]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
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
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                handleInputChange('CodigoPostal', value);
              }}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              maxLength="6"
            />
            {errors.CodigoPostal && <span className="error">{errors.CodigoPostal}</span>}
          </div>
          <div className="form-field">
            <label>País</label>
            <input
              type="text"
              value={address.Pais}
              onChange={(e) => handleInputChange('Pais', e.target.value)}
              onKeyPress={(e) => {
                if (!/[a-zA-Z\s]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            {errors.Pais && <span className="error">{errors.Pais}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Tipo de Dirección</label>
            <select
              value={address.tipo_direccion}
              onChange={(e) => handleInputChange('tipo_direccion', e.target.value)}
            >
              {addressTypes.map(type => (
                <option key={type.id} value={type.id}>{type.nombre.toUpperCase()}</option>
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
