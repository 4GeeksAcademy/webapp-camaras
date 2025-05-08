// ✅ Refuerzo extra: también aplicado a VideoWallMenu y componentes similares
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import '../assets/Map.css';
import L from 'leaflet';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function Mapa() {
  const [camaras, setCamaras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cameras', {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    })
      .then(async response => {
        setLoading(false);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setCamaras(data);
          } else {
            console.error('Respuesta inesperada (no es array):', data);
            setCamaras([]);
          }
        } else if (response.status === 401) {
          console.warn('⚠️ No autorizado: redirigiendo a login');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          const errorData = await response.text();
          console.error('Error al cargar cámaras:', errorData);
          setCamaras([]);
        }
      })
      .catch(error => {
        setLoading(false);
        console.error('Error al cargar las cámaras:', error);
        setCamaras([]);
      });
  }, []);

  return (
    <div className="content-container">
      {loading ? (
        <p style={{ padding: '1rem' }}>Cargando cámaras...</p>
      ) : (
        <MapContainer center={[41.38879, 2.15899]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {Array.isArray(camaras) && camaras.length > 0 ? (
            camaras.map((camara) => {
              const lat = parseFloat(camara.location?.lat);
              const lng = parseFloat(camara.location?.lng);

              if (isNaN(lat) || isNaN(lng)) return null;

              return (
                <Marker key={camara.id} position={[lat, lng]}>
                  <Popup minWidth={300}>
                    <PopupContent camara={camara} />
                  </Popup>
                </Marker>
              );
            })
          ) : (
            <p style={{ padding: '1rem' }}>No hay cámaras disponibles o hubo un error al cargarlas.</p>
          )}
        </MapContainer>
      )}
    </div>
  );
}

function PopupContent({ camara }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      const host = window.location.host;
      const wsHost = host.replace(/-3000(\.|$)/, '-9999$1');
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const wsUrl = `${protocol}://${wsHost}/stream/${camara.id}`;

      const player = new JSMpeg.VideoElement(videoRef.current, wsUrl, {
        autoplay: true,
        loop: true,
        disableGl: true,
        progressive: true,
      });

      playerRef.current = player;
    }

    return () => {
      if (playerRef.current) {
        try {
          if (playerRef.current.source && playerRef.current.source.socket) {
            playerRef.current.destroy();
          }
        } catch (err) {
          console.warn('Error destruyendo player JSMpeg:', err);
        }
        playerRef.current = null;
      }
    };
  }, [camara.id]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h3>{camara.name}</h3>
      <div
        ref={videoRef}
        style={{ width: '280px', height: '180px', backgroundColor: '#000', marginTop: '10px' }}
      />
    </div>
  );
}

export default Mapa;
