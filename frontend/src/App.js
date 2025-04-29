import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import LeftBar from './components/LeftBar';
import VideoWall from './pages/VideoWall';
import Mapa from './pages/Mapa';
import Registros from './pages/Registros';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [videoLayout, setVideoLayout] = useState('1');
  const [selectedCameras, setSelectedCameras] = useState([]);
  const [showModal, setShowModal] = useState(false);

  return (
    <Router>
      <Header />
      {/* LeftBar recibe funciones como props */}
      <LeftBar 
        setShowModal={setShowModal}
        setVideoLayout={setVideoLayout}
        setSelectedCameras={setSelectedCameras}
      />
      
      {/* Solo el contenido de la página, sin el menú de botones */}
      <div>
        <Routes>
          <Route path="/" element={
            <VideoWall 
              layout={videoLayout} 
              selectedCameras={selectedCameras} 
            />
          } />

          <Route path="/mapa" element={<Mapa />} />
          <Route path="/registros" element={<Registros />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
