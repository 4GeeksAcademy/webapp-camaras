// frontend/src/components/VideoWallMenu.jsx
import React, { useEffect, useState } from "react";
import CameraModal from "./CameraModal";
import '../assets/VideoWallMenu.css';

function VideoWallMenu({ setVideoLayout, setSelectedCameras }) {
  const [cameras, setCameras] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Carga inicial de cámaras
  useEffect(() => {
    fetch('/api/cameras')
      .then(response => response.json())
      .then(data => setCameras(data))
      .catch(error => console.error('Error al cargar las cámaras:', error));
  }, []);

  // Alterna selección para el video wall
  const handleCameraClick = (cam) => {
    setSelectedCameras(prev => {
      const exists = prev.find(c => c.id === cam.id);
      if (exists) {
        return prev.filter(c => c.id !== cam.id);
      } else {
        return [...prev, cam];
      }
    });
  };

  // Elimina la cámara de la DB y del estado local
  const handleDeleteCamera = (camId) => {
    fetch(`/api/cameras/${camId}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        // Actualiza la lista de cámaras
        setCameras(prev => prev.filter(c => c.id !== camId));
        // También quita de las seleccionadas, si estaba
        setSelectedCameras(prev => prev.filter(c => c.id !== camId));
      })
      .catch(err => console.error('Error al eliminar cámara:', err));
  };

  return (
    <div className="video-wall-menu">
      {/* Controles de layout */}
      <div className="layout-select">
        <button onClick={() => setVideoLayout('1')}>1</button>
        <button onClick={() => setVideoLayout('4')}>4</button>
        <button onClick={() => setVideoLayout('9')}>9</button>
      </div>

      {/* Listado de cámaras */}
      <div className="camera-list">
        <ul>
          {cameras.map(cam => (
            <li
              key={cam.id}
              className="camera-item"
              onClick={() => handleCameraClick(cam)}
            >
              {/* Nombre de la cámara */}
              <span>{cam.name}</span>
              {/* Botón de eliminar */}
              <button
                className="delete-btn"
                onClick={e => {
                  e.stopPropagation();          // evita toggles de selección
                  handleDeleteCamera(cam.id);
                }}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Botón para añadir nuevas cámaras */}
      <button
        className="add-camera-btn"
        onClick={() => setShowModal(true)}
      >
        + Añadir cámara
      </button>

      {showModal && <CameraModal onClose={() => setShowModal(false)} addCameraToList={(newCamera) => setCameras(prev => [...prev, newCamera])} />}
    </div>
  );
}

export default VideoWallMenu;
