import React, { useEffect, useState } from 'react';
import { getAuthHeader } from '../utils/auth';

function Registros() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch('/api/alpr-records', {
      headers: getAuthHeader(),
    })
      .then(response => response.json())
      .then(data => setRecords(data))
      .catch(err => console.error('Error al cargar registros:', err));
  }, []);

  return (
    <div className="content-container">
      <h2>Registros ALPR</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cámara</th>
            <th>Matrícula</th>
            <th>Fecha</th>
            <th>Confianza</th>
            <th>Color</th>
            <th>Tipo</th>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Dirección</th>
            <th>Imagen</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.camera_name}</td>
              <td>{record.plate_number}</td>
              <td>{record.detected_at}</td>
              <td>{record.confidence}%</td>
              <td>{record.vehicle_color}</td>
              <td>{record.vehicle_type}</td>
              <td>{record.vehicle_model}</td>
              <td>{record.vehicle_make}</td>
              <td>{record.direction}</td>
              <td>
                {record.image_url ? (
                  <img
                    src={`data:image/jpeg;base64,${record.image_url}`}
                    alt="captura"
                    style={{ width: '100px' }}
                  />
                ) : (
                  'Sin imagen'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Registros;