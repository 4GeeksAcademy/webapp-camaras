// ✅ Código corregido para asegurar que setVideoLayout siempre se pasa correctamente

import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import LeftBar from './components/LeftBar';
import VideoWall from './pages/VideoWall';
import Mapa from './pages/Mapa';
import Registros from './pages/Registros';
import Ajustes from './pages/Ajustes';
import Ajustes1 from './pages/Ajustes1';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

function LayoutWrapper({ children, setVideoLayout, setSelectedCameras }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && !isLoginPage) {
      navigate('/login');
    }
  }, [location, navigate, isLoginPage]);

  return (
    <>
      {!isLoginPage && (
        <>
          <Header />
          <LeftBar setVideoLayout={setVideoLayout} setSelectedCameras={setSelectedCameras} />
        </>
      )}
      {children}
    </>
  );
}

function App() {
  const [videoLayout, setVideoLayout] = useState('1');
  const [selectedCameras, setSelectedCameras] = useState([]);

  return (
    <Router>
      <LayoutWrapper setVideoLayout={setVideoLayout} setSelectedCameras={setSelectedCameras}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <PrivateRoute>
              <VideoWall layout={videoLayout} selectedCameras={selectedCameras} />
            </PrivateRoute>
          } />

          <Route path="/mapa" element={<PrivateRoute><Mapa /></PrivateRoute>} />
          <Route path="/registros" element={<PrivateRoute><Registros /></PrivateRoute>} />
          <Route path="/ajustes" element={<PrivateRoute><Ajustes /></PrivateRoute>} />
          <Route path="/ajustes1" element={<PrivateRoute><Ajustes1 /></PrivateRoute>} />
          <Route path="/register" element={<PrivateRoute><Register /></PrivateRoute>} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
