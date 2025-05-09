# backend/routes/user_routes.py

from flask import Blueprint, request, jsonify
from models.db import db, User
from werkzeug.security import generate_password_hash

user_bp = Blueprint('user_bp', __name__)

# Obtener todos los usuarios
@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    result = [{
        'id': u.id,
        'username': u.username,
        'email': u.email,
        'role': u.role
    } for u in users]
    return jsonify(result), 200

# Crear un nuevo usuario
@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        username=data['username'],
        email=data['email'],
        role=data.get('role', 'operator'),
        password_hash=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "Usuario creado", "id": new_user.id}), 201

# Actualizar usuario existente
@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    user.username = data['username']
    user.email = data['email']
    user.role = data['role']
    db.session.commit()
    return jsonify({"msg": "Usuario actualizado"}), 200

# Eliminar usuario
@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "Usuario eliminado"}), 200
