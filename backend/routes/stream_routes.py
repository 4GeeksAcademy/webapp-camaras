from flask import Blueprint, Response, jsonify
from models.db import Camera
import requests
from requests.auth import HTTPDigestAuth

stream_bp = Blueprint('stream_bp', __name__)

@stream_bp.route('/api/stream/<int:camera_id>')
def stream_camera(camera_id):
    # Buscar la cámara en la base de datos
    camera = Camera.query.get(camera_id)
    if not camera:
        return jsonify({"error": "Cámara no encontrada"}), 404

    # URL sin credenciales embebidas
    camera_url = f"http://{camera.ip_address}/axis-cgi/mjpg/video.cgi"

    try:
        # Con Digest Auth (AXIS Q1785-LE lo requiere)
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
