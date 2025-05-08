from extensions import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # Solo usamos esta columna



class Camera(db.Model):
    __tablename__ = 'cameras'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    ip_address = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(50))
    password = db.Column(db.String(50))
    connection_method = db.Column(db.String(20))
    location_lat = db.Column(db.Numeric(9,6))
    location_lng = db.Column(db.Numeric(9,6))
    is_active = db.Column(db.Boolean, default=True)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'ip_address': self.ip_address,
            'username': self.username,
            'connection_method': self.connection_method,
            'location': {
                'lat': str(self.location_lat) if self.location_lat else None,
                'lng': str(self.location_lng) if self.location_lng else None
            },
            'is_active': self.is_active
        }


class ALPRRecord(db.Model):
    __tablename__ = 'alpr_records'

    id = db.Column(db.Integer, primary_key=True)
    camera_id = db.Column(db.Integer, db.ForeignKey('cameras.id'))
    plate_number = db.Column(db.String(20))
    detected_at = db.Column(db.DateTime)
    image_url = db.Column(db.String(255))
    country = db.Column(db.String(10))
    confidence = db.Column(db.Numeric(5,2))
    left_pos = db.Column(db.Integer)
    top_pos = db.Column(db.Integer)
    right_pos = db.Column(db.Integer)
    bottom_pos = db.Column(db.Integer)
    char_height = db.Column(db.Integer)
    processing_time = db.Column(db.Integer)
    multiplate = db.Column(db.String(10))
    direction = db.Column(db.String(10))
    vehicle_type = db.Column(db.String(20))
    vehicle_color = db.Column(db.String(20))
    vehicle_model = db.Column(db.String(50))
    vehicle_make = db.Column(db.String(50))
