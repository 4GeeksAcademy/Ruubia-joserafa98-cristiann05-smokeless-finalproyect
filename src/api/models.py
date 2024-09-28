from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }

class Coach(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email_coach = db.Column(db.String(120), unique=True, nullable=False)
    password_coach = db.Column(db.String(128), nullable=False)
    nombre_coach = db.Column(db.String(50), nullable=False)
    genero_coach = db.Column(db.String(10), nullable=False)
    direccion = db.Column(db.String(200))
    latitud = db.Column(db.Float)
    longitud = db.Column(db.Float)
    descripcion_coach = db.Column(db.Text)
    foto_coach = db.Column(db.String(200))
    precio_servicio = db.Column(db.Float)

    def __repr__(self):
        return f'<Coach {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email_coach": self.email_coach,
            "nombre_coach": self.nombre_coach,
            "genero_coach": self.genero_coach,
            "direccion": self.direccion,
            "latitud": self.latitud,
            "longitud": self.longitud,
            "descripcion_coach": self.descripcion_coach,
            "foto_coach": self.foto_coach,
            "precio_servicio": self.precio_servicio
        }
    
class SmokerUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email_usuario = db.Column(db.String(120), unique=True, nullable=False)
    password_email = db.Column(db.String(80), unique=False, nullable=False)
    nombre_usuario = db.Column(db.String(80), nullable=False)
    genero_usuario = db.Column(db.String(10), nullable=False)
    nacimiento_usuario = db.Column(db.Date, nullable=False)
    numerocigarro_usuario = db.Column(db.Integer, nullable=False)
    periodicidad = db.Column(db.String(50), nullable=False)
    tiempo_fumando = db.Column(db.String(10), nullable=False)
    id_tipo = db.Column(db.Integer, nullable=False)
    foto_usuario = db.Column(db.String(255), nullable=True)  # Puede ser una URL o ruta

    def __repr__(self):
        return f'<SmokerUser {self.email_usuario}>'

    def serialize(self):
        return {
            "id": self.id,
            "email_usuario": self.email_usuario,
            "nombre_usuario": self.nombre_usuario,
            "genero_usuario": self.genero_usuario,
            "nacimiento_usuario": self.nacimiento_usuario.isoformat(),
            "numerocigarro_usuario": self.numerocigarro_usuario,
            "periodicidad": self.periodicidad,
            "tiempo_fumando": self.tiempo_fumando,
            "id_tipo": self.id_tipo,
            "foto_usuario": self.foto_usuario
            # do not serialize the password, its a security breach
        }
class TiposConsumo(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        name = db.Column(db.String(120), unique=True, nullable=False)

        def __repr__(self):
            return f'<TiposConsumo {self.name}>'

        def serialize(self):
            return {
                "id": self.id,
                "name": self.name,
                # do not serialize the password, its a security breach
            }
