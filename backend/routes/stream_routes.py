from flask import Blueprint, request, Response, jsonify
from models.db import db, Camera
import requests

stream_bp = Blueprint('stream_bp', __name__)

@stream_bp.route('/api/stream/<int:camera_id>')
def stream_camera(camera_id):
    # Buscar la cámara por su ID en la base de datos
    camera = Camera.query.get(camera_id)

    if not camera:
        return jsonify({"error": "Cámara no encontrada"}), 404

    # Construir la URL de conexión segura
    camera_url = f"http://{camera.username}:{camera.password}@{camera.ip_address}/axis-cgi/mjpg/video.cgi"

    try:
        # Hacer una conexión en streaming hacia la cámara
        stream = requests.get(camera_url, stream=True, timeout=5)

        return Response(
            stream.iter_content(chunk_size=1024),
            content_type=stream.headers['Content-Type']
        )
    except Exception as e:
        print(f"Error al conectar a la cámara {camera.name}: {str(e)}")
        return jsonify({"error": "No se pudo conectar a la cámara"}), 500
