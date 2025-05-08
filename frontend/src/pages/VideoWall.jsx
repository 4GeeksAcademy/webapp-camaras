// ✅ Volvemos a incluir fetch sin token, backend debe aceptar peticiones públicas
import React, { useEffect, useRef, useState } from 'react';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import '../assets/VideoWall.css';

function VideoWall({ layout, selectedCameras }) {
  const containerRefs = useRef({});
  const playersRef = useRef({});
  const count = parseInt(layout, 10);

  useEffect(() => {
    const activeIds = selectedCameras.slice(0, count).map(c => c.id);
    Object.keys(playersRef.current).forEach(id => {
      if (!activeIds.includes(Number(id))) {
        playersRef.current[id].destroy();
        delete playersRef.current[id];
      }
    });

    selectedCameras.slice(0, count).forEach(cam => {
      if (playersRef.current[cam.id]) return;

      const container = containerRefs.current[cam.id];
      if (!container) return;

      const host = window.location.host;
      const wsHost = host.replace(/-3000(\.|$)/, '-9999$1');
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const wsUrl = `${protocol}://${wsHost}/stream/${cam.id}`;

      const player = new JSMpeg.VideoElement(container, wsUrl, {
        autoplay: true,
        loop: true
      });
      playersRef.current[cam.id] = player;
    });

    return () => {
      Object.values(playersRef.current).forEach(p => p.destroy());
      playersRef.current = {};
    };
  }, [layout, selectedCameras]);

  let boxClass = '';
  if (layout === '1') boxClass = 'videoBox1';
  else if (layout === '4') boxClass = 'videoBox4';
  else if (layout === '9') boxClass = 'videoBox9';

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
