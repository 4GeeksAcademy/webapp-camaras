import React from 'react';
import { useLocation } from 'react-router-dom'; // Importamos useLocation
import '../assets/LeftBar.css';
import VideoWallMenu from './VideoWallMenu';   // importamos VideoWallMenu

function LeftBar({ setShowModal, setVideoLayout, setSelectedCameras }) {
    const location = useLocation(); // Obtiene la ruta actual

    return (
        <div className="leftbar-container">
            {location.pathname === '/' && (
                <VideoWallMenu 
                  setShowModal={setShowModal}
                  setVideoLayout={setVideoLayout}
                  setSelectedCameras={setSelectedCameras}
                />
            )}

            {location.pathname === '/mapa' && (
                <div className="leftbar-content">
                    <h2>Mapa</h2>
                    <p>Aquí irá el menú del Mapa.</p>
                </div>
            )}

            {location.pathname === '/registros' && (
                <div className="leftbar-content">
                    <h2>Registros ALPR</h2>
                    <p>Aquí irá el menú de los registros ALPR.</p>
                </div>
            )}
        </div>
    );
}

export default LeftBar;
