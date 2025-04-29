import React, { useEffect, useState } from "react";
import CameraModal from "./CameraModal"; // IMPORTANTE importar el Modal
import '../assets/VideoWallMenu.css';

function VideoWallMenu({ setVideoLayout, setSelectedCameras }) {
    const [cameras, setCameras] = useState([]);
    const [showModal, setShowModal] = useState(false); // AÑADIDO para controlar el modal

    useEffect(() => {
        fetch('https://redesigned-invention-q7pgr7v4445vf4gpv-5000.app.github.dev/api/cameras')
            .then(response => response.json())
            .then(data => setCameras(data))
            .catch(error => console.error('Error al cargar las cámaras:', error));
    }, []);

    const handleCameraClick = (cameraId) => {
        const index = cameras.findIndex(c => c.id === cameraId);
        if (index !== -1) {
            const selected = cameras.slice(index, index + 9); // hasta 9 cámaras
            setSelectedCameras(selected);
        }
    };

    const handleDeleteCamera = (cameraId) => {
        if (window.confirm('¿Seguro que quieres eliminar esta cámara?')) {
            fetch(`https://redesigned-invention-q7pgr7v4445vf4gpv-5000.app.github.dev/api/cameras/${cameraId}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                    setCameras(prevCameras => prevCameras.filter(cam => cam.id !== cameraId));
                } else {
                    console.error('Error al eliminar la cámara');
                }
            })
            .catch(error => console.error('Error en la solicitud de eliminación:', error));
        }
    };

    return (
        <div className="video-wall-menu">
            <button onClick={() => setShowModal(true)}>➕ Añadir Cámara</button>
            <button onClick={() => setVideoLayout('1')}>1 Cuadro</button>
            <button onClick={() => setVideoLayout('4')}>4 Cuadros</button>
            <button onClick={() => setVideoLayout('9')}>9 Cuadros</button>

            <div className="camera-list">
                <h3>Listado de Cámaras</h3>
                <ul>
                    {cameras.map(camera => (
                        <li 
                            key={camera.id} 
                            className="camera-item"
                            onClick={() => handleCameraClick(camera.id)}
                        >
                            {camera.name}
                            <button 
                                className="delete-btn"
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    handleDeleteCamera(camera.id); 
                                }}
                            >
                                ❌
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modal para añadir cámaras */}
            {showModal && <CameraModal setShowModal={setShowModal} />}
        </div>
    );
}

export default VideoWallMenu;
