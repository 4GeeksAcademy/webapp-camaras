import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'postgresql://dev:password123@localhost:5432/webapp_camaras'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'super-secret-key')
    # Carpeta donde FFmpeg volcará los ficheros HLS
    HLS_FOLDER = os.getenv('HLS_FOLDER', '/tmp/hls')
