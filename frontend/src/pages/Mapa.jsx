import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import JSMpeg from '@cycjimmy/jsmpeg-player'; // Importamos JSMpeg
import '../assets/Map.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

function Mapa() {
    const [camaras, setCamaras] = React.useState([]);

    useEffect(() => {
        fetch('/api/cameras')
            .then(response => response.json())
            .then(data => {
                console.log("Cámaras recibidas del backend:", data);
                setCamaras(data);
            })
            .catch(error => {
                console.error('Error al cargar las cámaras:', error);
            });
    }, []);

    return (
        <div className="content-container">
            <MapContainer center={[40.4168, -3.7038]} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
                {camaras.map((camara) => {
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
                })}
            </MapContainer>
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
                progressive: true
            });

            playerRef.current = player;
        }

        return () => {
            if (playerRef.current) {
                try {
                    // Solo destruir si el player y su socket existen
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
