import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AddressList = ({ direcciones, handleAddAddressClick, handleEditAddressClick, handleDeleteAddressClick }) => {
  const [addressTypes, setAddressTypes] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/list-tipo-direccion/`)
      .then(response => response.json())
      .then(data => setAddressTypes(data))
      .catch(error => toast.error('Error fetching address types'));
  }, []);

  const getAddressTypeName = (id) => {
    const type = addressTypes.find(type => type.id === id);
    return type ? type.nombre.toUpperCase() : 'DESCONOCIDO';
  };

  return (
    <div className="direcciones-container">
      <h2>Direcciones</h2>
      <button className="add-direccion-button" onClick={handleAddAddressClick}>
        + NUEVA DIRECCIÓN
      </button>
      <table className="direcciones-table">
        <thead>
          <tr>
            <th>TIPO DE DIRECCIÓN</th>
            <th>CALLE</th>
            <th>CIUDAD</th>
            <th>PROVINCIA/ESTADO</th>
            <th>CODIGO POSTAL</th>
            <th>PAIS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {direcciones.map((direccion, index) => (
            <tr key={index}>
              <td>{getAddressTypeName(direccion.tipo_direccion)}</td>
              <td>{direccion.Calle}</td>
              <td>{direccion.Ciudad}</td>
              <td>{direccion.Estado}</td>
              <td>{direccion.CodigoPostal}</td>
              <td>{direccion.Pais}</td>
              <td>
                <button className="action-button" onClick={() => handleEditAddressClick(direccion)}><FaEdit /></button>
                <button className="action-button" onClick={() => handleDeleteAddressClick(direccion.id)}><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddressList;
