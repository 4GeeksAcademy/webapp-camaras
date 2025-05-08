import React, { useEffect, useState } from "react";
import CameraModal from "./CameraModal";
import '../assets/VideoWallMenu.css';

function VideoWallMenu({ setVideoLayout, setSelectedCameras }) {
  const [cameras, setCameras] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('/api/cameras')
      .then(async res => {
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setCameras(data);
          } else {
            console.error('⚠️ Respuesta inesperada (no es array):', data);
            setCameras([]);
          }
        } else {
          const errorText = await res.text();
          console.error('❌ Error al cargar cámaras:', errorText);
          setCameras([]);
        }
      })
      .catch(err => {
        console.error('❌ Error al cargar cámaras (catch):', err);
        setCameras([]);
      });
  }, []);

  const handleCameraClick = (cam) => {
    setSelectedCameras && setSelectedCameras(prev => {
      const exists = prev.find(c => c.id === cam.id);
      return exists ? prev.filter(c => c.id !== cam.id) : [...prev, cam];
    });
  };

  const handleDeleteCamera = (camId) => {
    fetch(`/api/cameras/${camId}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setCameras(prev => prev.filter(c => c.id !== camId));
        setSelectedCameras && setSelectedCameras(prev => prev.filter(c => c.id !== camId));
      })
      .catch(err => console.error('❌ Error al eliminar cámara:', err));
  };

  return (
    <div className="video-wall-menu">
      <div className="layout-select">
        <button onClick={() => setVideoLayout && setVideoLayout('1')}>1</button>
        <button onClick={() => setVideoLayout && setVideoLayout('4')}>4</button>
        <button onClick={() => setVideoLayout && setVideoLayout('9')}>9</button>
      </div>

      <div className="camera-list">
        <ul>
          {Array.isArray(cameras) && cameras.length > 0 ? (
            cameras.map(cam => (
              <li
                key={cam.id}
                className="camera-item"
                onClick={() => handleCameraClick(cam)}
              >
                <span>{cam.name}</span>
                <button
                  className="delete-btn"
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteCamera(cam.id);
                  }}
                >
                  ×
                </button>
              </li>
            ))
          ) : (
            <li style={{ padding: '0.5rem', listStyle: 'none' }}>No hay cámaras cargadas o hubo un error.</li>
          )}
        </ul>
      </div>

      <button className="add-camera-btn" onClick={() => setShowModal(true)}>
        + Añadir cámara
      </button>

      {showModal && (
        <CameraModal
          onClose={() => setShowModal(false)}
          addCameraToList={(newCamera) => setCameras(prev => [...prev, newCamera])}
        />
      )}
    </div>
  );
}

export default VideoWallMenu;
