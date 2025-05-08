from flask import Blueprint, request, jsonify
from models.db import ALPRRecord, Camera
from extensions import db
from flask_jwt_extended import jwt_required

alpr_bp = Blueprint('alpr', __name__)

# Recibir datos ALPR (sin auth, viene de las cámaras)
@alpr_bp.route('/alpr-records', methods=['POST'])
def receive_alpr():
    data = request.get_json()
    camera_id = data.get('id')

    camera = Camera.query.get(camera_id)
    if not camera:
        return jsonify({"error": "Cámara no encontrada"}), 404

    record = ALPRRecord(
        camera_id=camera_id,
        plate_number=data.get('plate'),
        detected_at=data.get('date'),
        image_url=data.get('image'),
        country=data.get('country'),
        confidence=data.get('confidence'),
        left_pos=data.get('left'),
        top_pos=data.get('top'),
        right_pos=data.get('right'),
        bottom_pos=data.get('bottom'),
        char_height=data.get('charheight'),
        processing_time=data.get('processingtime'),
        multiplate=data.get('multiplate'),
        direction=data.get('direction'),
        vehicle_type=data.get('vehicleType'),
        vehicle_color=data.get('vehicleColor'),
        vehicle_model=data.get('vehicleModel'),
        vehicle_make=data.get('vehicleMake')
    )
    db.session.add(record)
    db.session.commit()

    return jsonify({"message": "Registro guardado"}), 201

# Consultar registros ALPR (público, sin autenticación)
@alpr_bp.route('/alpr-records', methods=['GET'])
def get_alpr():
    records = db.session.query(ALPRRecord, Camera).join(Camera).order_by(ALPRRecord.detected_at.desc()).all()
    result = []
    for record, camera in records:
        result.append({
            'id': record.id,
            'camera_name': camera.name,
            'plate_number': record.plate_number,
            'detected_at': record.detected_at.isoformat() if record.detected_at else None,
            'image_url': record.image_url,
            'confidence': float(record.confidence) if record.confidence else None,
            'direction': record.direction,
            'vehicle_type': record.vehicle_type,
            'vehicle_color': record.vehicle_color,
            'vehicle_model': record.vehicle_model,
            'vehicle_make': record.vehicle_make
        })
    return jsonify(result)

# ✅ Nota:
# Hemos quitado @jwt_required del GET /alpr-records para que sea accesible públicamente.
# Si quieres volver a protegerlo, solo vuelve a añadir @jwt_required() arriba de la función get_alpr.
