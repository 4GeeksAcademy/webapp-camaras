from flask import Flask
from config import Config
from extensions import db, jwt
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)

    # Permitir CORS para todo
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Importar Blueprints
    from routes.auth_routes import auth_bp
    from routes.camera_routes import camera_bp
    from routes.stream_routes import stream_bp
    from routes.hls_routes import hls_bp
    from routes.alpr_routes import alpr_bp  # ✅ IMPORTA AQUI
    from routes.user_routes import user_bp  # ✅ IMPORTAMOS USER ROUTES

    # Registrar Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(camera_bp, url_prefix='/api')
    app.register_blueprint(stream_bp)
    app.register_blueprint(hls_bp)
    app.register_blueprint(alpr_bp, url_prefix='/api')  # ✅ REGISTRA AQUI
    app.register_blueprint(user_bp, url_prefix='/api')  # ✅ REGISTRAMOS USER ROUTES

    # Importar modelos para que SQLAlchemy los reconozca
    import models.db

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
