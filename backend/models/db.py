from extensions import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role_id = db.Column(db.Integer, nullable=False)


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
