// frontend/src/components/RegistrosMenu.jsx
import React, { useState, useEffect } from 'react';

function RegistrosMenu({ setFilters }) {
  const [camaras, setCamaras] = useState([]);
  const [localFilters, setLocalFilters] = useState({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    cameraId: '',
    plate: '',
    vehicleType: '',
    vehicleMake: '',
    vehicleModel: ''
  });

  useEffect(() => {
    fetch('/api/cameras')
      .then(res => res.json())
      .then(data => setCamaras(data))
      .catch(err => console.error('❌ Error al cargar cámaras:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilters(localFilters);
  };

  return (
    <div className="registros-menu" style={{ marginBottom: '1rem' }}>
      <h3>Filtros</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Fecha inicio:
            <input type="date" name="startDate" value={localFilters.startDate} onChange={handleChange} />
          </label>
        </div>

        <div>
          <label>
            Fecha fin:
            <input type="date" name="endDate" value={localFilters.endDate} onChange={handleChange} />
          </label>
        </div>

        <div>
          <label>
            Hora inicio:
            <input type="time" name="startTime" value={localFilters.startTime} onChange={handleChange} />
          </label>
        </div>

        <div>
          <label>
            Hora fin:
            <input type="time" name="endTime" value={localFilters.endTime} onChange={handleChange} />
          </label>
        </div>

        <div>
          <label>
            Cámara:
            <select name="cameraId" value={localFilters.cameraId} onChange={handleChange}>
              <option value="">Todas</option>
              {camaras.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label>
            Matrícula:
            <input type="text" name="plate" value={localFilters.plate} onChange={handleChange} placeholder="Ej: 1234ABC" />
          </label>
        </div>

        <div>
          <label>
            Tipo de vehículo:
            <input type="text" name="vehicleType" value={localFilters.vehicleType} onChange={handleChange} placeholder="Ej: Car" />
          </label>
        </div>

        <div>
          <label>
            Marca:
            <input type="text" name="vehicleMake" value={localFilters.vehicleMake} onChange={handleChange} placeholder="Ej: Mercedes" />
          </label>
        </div>

        <div>
          <label>
            Modelo:
            <input type="text" name="vehicleModel" value={localFilters.vehicleModel} onChange={handleChange} placeholder="Ej: A Class" />
          </label>
        </div>

        <button type="submit" style={{ marginTop: '1rem' }}>Buscar</button>
      </form>
    </div>
  );
}

export default RegistrosMenu;
