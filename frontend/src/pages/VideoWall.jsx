// frontend/src/pages/VideoWall.jsx
import React, { useEffect, useRef } from 'react';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import '../assets/VideoWall.css';

function VideoWall({ layout, selectedCameras }) {
  const containerRefs = useRef({});
  const playersRef = useRef({});
  const count = parseInt(layout, 10);

  useEffect(() => {
    // Destruye cualquier player que ya no corresponda
    const activeIds = selectedCameras.slice(0, count).map(c => c.id);
    Object.keys(playersRef.current).forEach(id => {
      if (!activeIds.includes(Number(id))) {
        playersRef.current[id].destroy();
        delete playersRef.current[id];
      }
    });

    // Crea un player por cada cámara activa
    selectedCameras.slice(0, count).forEach(cam => {
      if (playersRef.current[cam.id]) return; // ya existe

      const container = containerRefs.current[cam.id];
      if (!container) return;

      // En Codespaces el host es algo-3000.app.github.dev para React,
      // y algo-9999.app.github.dev para tu WebSocket streamer
      const host = window.location.host; 
      const wsHost = host.replace(/-3000(\.|$)/, '-9999$1');
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const wsUrl = `${protocol}://${wsHost}/stream/${cam.id}`;

      // VideoElement inyecta internamente un <canvas> dentro del div
      const player = new JSMpeg.VideoElement(container, wsUrl, {
        autoplay: true,
        loop: true
      });
      playersRef.current[cam.id] = player;
    });

    // Cleanup al desmontar o cambiar layout/selección
    return () => {
      Object.values(playersRef.current).forEach(p => p.destroy());
      playersRef.current = {};
    };
  }, [layout, selectedCameras]);

  // Determina la clase CSS según el layout
  let boxClass = '';
  if (layout === '1') boxClass = 'videoBox1';
  else if (layout === '4') boxClass = 'videoBox4';
  else if (layout === '9') boxClass = 'videoBox9';

  // Renderiza las cajas
  const boxes = [];
  for (let i = 0; i < count; i++) {
    const cam = selectedCameras[i];
    boxes.push(
      <div key={i} className={boxClass}>
        {cam ? (
          <div
            ref={el => {
              if (el) containerRefs.current[cam.id] = el;
            }}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#222',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            Sin cámara
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="content-container">
      {boxes}
    </div>
  );
}

export default VideoWall;
