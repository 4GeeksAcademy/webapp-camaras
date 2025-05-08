import os
import subprocess
from flask import Blueprint, current_app, send_from_directory, jsonify
from models.db import Camera

hls_bp = Blueprint('hls_bp', __name__)

def start_hls_for_camera(camera):
    hls_folder = current_app.config['HLS_FOLDER']
    cam_dir = os.path.join(hls_folder, str(camera.id))
    os.makedirs(cam_dir, exist_ok=True)
    playlist = os.path.join(cam_dir, 'index.m3u8')

    # Solo lanzamos FFmpeg la primera vez
    if not os.path.exists(playlist):
        rtsp_url = (
            f"rtsp://{camera.username}:"
            f"{camera.password}@{camera.ip_address}/axis-media/media.amp"
        )
        cmd = [
            'ffmpeg',
            '-rtsp_transport', 'tcp',
            '-re',
            '-i', rtsp_url,
            '-c:v', 'copy',
            '-an',
            '-f', 'hls',
            '-hls_time', '2',
            '-hls_list_size', '3',
            '-hls_flags', 'delete_segments+omit_endlist',
            '-hls_allow_cache', '0',
            '-hls_segment_filename', os.path.join(cam_dir, 'segment_%03d.ts'),
            playlist
        ]
        subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    return cam_dir

# Servir HLS (público, sin autenticación)
@hls_bp.route('/api/hls/<int:camera_id>/<path:filename>')
def serve_hls(camera_id, filename):
    camera = Camera.query.get(camera_id)
    if not camera:
        return jsonify({"error": "Cámara no encontrada"}), 404

    cam_dir = start_hls_for_camera(camera)
    return send_from_directory(cam_dir, filename)

# ✅ Nota: este endpoint está público para que el frontend pueda acceder a los streams HLS sin autenticación.
# Si necesitas protegerlo, puedes agregar decoradores como @jwt_required() más adelante solo si es necesario.
