from flask import Blueprint, Response, jsonify
from models.db import Camera
import requests
from requests.auth import HTTPDigestAuth

stream_bp = Blueprint('stream_bp', __name__)

# Stream MJPEG público (sin autenticación)
@stream_bp.route('/api/stream/<int:camera_id>')
def stream_camera(camera_id):
    camera = Camera.query.get(camera_id)
    if not camera:
        return jsonify({"error": "Cámara no encontrada"}), 404

    camera_url = f"http://{camera.ip_address}/axis-cgi/mjpg/video.cgi"

    try:
        stream = requests.get(
            camera_url,
            auth=HTTPDigestAuth(camera.username, camera.password),
            stream=True,
            timeout=10
        )
        return Response(
            stream.iter_content(chunk_size=1024),
            content_type=stream.headers.get(
                'Content-Type',
                'multipart/x-mixed-replace;boundary=--myboundary'
            )
        )
    except Exception as e:
        print(f"Error al conectar a la cámara {camera.name}: {e}")
        return jsonify({"error": "No se pudo conectar al stream"}), 500

# ✅ Nota: este endpoint queda público para que el frontend pueda acceder directamente al stream.
# Si en el futuro quieres protegerlo, puedes añadir @jwt_required() encima de stream_camera.
