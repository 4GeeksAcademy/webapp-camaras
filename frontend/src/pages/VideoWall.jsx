import React from "react";
import '../assets/VideoWall.css';

function VideoWall({ layout, selectedCameras }) {
    let boxClass = '';
    let boxes = [];

    if (layout === '1') {
        boxClass = 'videoBox1';
    } else if (layout === '4') {
        boxClass = 'videoBox4';
    } else if (layout === '9') {
        boxClass = 'videoBox9';
    }

    for (let i = 0; i < parseInt(layout); i++) {
        const camera = selectedCameras[i];

        boxes.push(
            <div key={i} className={boxClass}>
                {camera ? (
                    <img 
                        src={`https://redesigned-invention-q7pgr7v4445vf4gpv-5000.app.github.dev/api/stream/${camera.id}`}
                        alt={`Stream de ${camera.name}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.parentNode.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:white;">Error de conexión</div>';
                        }}
                    />
                ) : (
                    <div style={{
                        width: '100%', height: '100%',
                        backgroundColor: '#222',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
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
