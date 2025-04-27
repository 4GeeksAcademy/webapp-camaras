
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models.db import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(username=username).first()

        if user and password == 'admin123':
            access_token = create_access_token(identity={'id': user.id, 'role': user.role_id})
            return jsonify(access_token=access_token), 200
        return jsonify({"msg": "Bad username or password"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500
