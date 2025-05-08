from flask import Blueprint, request, jsonify, Response, stream_with_context
from models.db import db, Camera
import requests
from flask_jwt_extended import jwt_required
from utils.auth import role_required

camera_bp = Blueprint('camera_bp', __name__)

# Añadir cámara (solo admin)
@camera_bp.route('/cameras', methods=['POST'])
@jwt_required()
@role_required('admin')
def add_camera():
    data = request.get_json()
    required_fields = ['name', 'ip_address', 'connection_method']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Falta el campo requerido: {field}"}), 400

    new_camera = Camera(
        name=data['name'],
        ip_address=data['ip_address'],
        username=data.get('username'),
        password=data.get('password'),
        connection_method=data['connection_method'],
        location_lat=data.get('location_lat'),
        location_lng=data.get('location_lng'),
        is_active=data.get('is_active', True)
    )

    db.session.add(new_camera)
    db.session.commit()

    return jsonify({"message": "Cámara añadida correctamente", "camera": new_camera.serialize()}), 201

# Listar cámaras (público, sin autenticación)
@camera_bp.route('/cameras', methods=['GET'])
def get_cameras():
    cameras = Camera.query.all()
    camera_list = [cam.serialize() for cam in cameras]
    return jsonify(camera_list), 200

# Eliminar cámara (solo admin)
@camera_bp.route('/cameras/<int:camera_id>', methods=['DELETE'])
@jwt_required()
@role_required('admin')
def delete_camera(camera_id):
    camera = Camera.query.get(camera_id)
    if not camera:
        return jsonify({"error": "Cámara no encontrada"}), 404

    db.session.delete(camera)
    db.session.commit()

    return jsonify({"message": "Cámara eliminada correctamente"}), 200

# Stream MJPEG (público, sin autenticación)
@camera_bp.route('/stream/<int:camera_id>', methods=['GET'])
def stream_camera(camera_id):
    camera = Camera.query.get(camera_id)
    if not camera:
        return jsonify({"error": "Cámara no encontrada"}), 404

    try:
        username = camera.username or ''
        password = camera.password or ''
        ip_address = camera.ip_address

        mjpeg_url = f"http://{username}:{password}@{ip_address}/axis-cgi/mjpg/video.cgi"

        r = requests.get(mjpeg_url, stream=True, timeout=10)

        def generate():
            for chunk in r.iter_content(chunk_size=1024):
                if chunk:
                    yield chunk

        return Response(stream_with_context(generate()), content_type='multipart/x-mixed-replace; boundary=--myboundary')

    except Exception as e:
        print(f"Error al conectar a la cámara {camera_id}: {e}")
        return jsonify({"error": "No se pudo conectar al stream de la cámara"}), 500
