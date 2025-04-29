import React from 'react';
import '../assets/LeftBar.css';
import VideoWallMenu from './VideoWallMenu';   // importamos aquí

function LeftBar({ setShowModal, setVideoLayout, setSelectedCameras }) {
    return (
        <div className="leftbar-container">
            {/* Solo en la página principal mostramos VideoWallMenu */}
            <VideoWallMenu 
              setShowModal={setShowModal}
              setVideoLayout={setVideoLayout}
              setSelectedCameras={setSelectedCameras}
            />
        </div>
    );
}

export default LeftBar;
