from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models.db import User, db
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'operator')  # por defecto operador

        if User.query.filter_by(username=username).first():
            return jsonify({"msg": "El usuario ya existe"}), 400

        hashed_password = generate_password_hash(password)
        new_user = User(username=username, email=email, password_hash=hashed_password, role=role)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"msg": "Usuario registrado correctamente"}), 201

    except Exception as e:
        print('Error en registro:', e)
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print('Received login data:', data)

        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(username=username).first()
        print('Queried user:', user)

        if user:
            print('User password hash:', user.password_hash)
            password_matches = check_password_hash(user.password_hash, password)
            print('Password match result:', password_matches)
        else:
            print('User not found in database.')

        if user and password_matches:
            access_token = create_access_token(identity={'id': user.id, 'role': user.role})
            print('Login successful, returning token.')
            return jsonify(access_token=access_token, user={'id': user.id, 'username': user.username, 'role': user.role}), 200

        print('Login failed: bad username or password.')
        return jsonify({"msg": "Bad username or password"}), 401

    except Exception as e:
        print('Internal error during login:', e)
        return jsonify({"error": str(e)}), 500
