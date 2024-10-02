from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

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
        return f'<Coach {self.email_coach}>'
    
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
            "precio_servicio": self.precio_servicio,
        }

class SmokerUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email_usuario = db.Column(db.String(120), unique=True, nullable=False)
    password_email = db.Column(db.String(80), nullable=False)
    nombre_usuario = db.Column(db.String(80), nullable=True)  # Opcional
    genero_usuario = db.Column(db.String(10), nullable=True)  # Opcional
    nacimiento_usuario = db.Column(db.Date, nullable=True)  # Opcional
    numerocigarro_usuario = db.Column(db.Integer, nullable=True)  # Opcional
    periodicidad = db.Column(db.String(50), nullable=True)  # Opcional
    tiempo_fumando = db.Column(db.String(10), nullable=True)  # Opcional
    id_tipo = db.Column(db.Integer, db.ForeignKey('tipos_consumo.id'), nullable=True)  # Opcional
    tipo_consumo = db.relationship('TiposConsumo', backref='smokers')
    foto_usuario = db.Column(db.String(255), nullable=True)  # Opcional

    def __repr__(self):
        return f'<SmokerUser {self.email_usuario}>'

    def serialize(self):
        return {
            "id": self.id,
            "email_usuario": self.email_usuario,
            "nombre_usuario": self.nombre_usuario,
            "genero_usuario": self.genero_usuario,
            "nacimiento_usuario": self.nacimiento_usuario.isoformat() if self.nacimiento_usuario else None,
            "numerocigarro_usuario": self.numerocigarro_usuario,
            "periodicidad": self.periodicidad,
            "tiempo_fumando": self.tiempo_fumando,
            "id_tipo": self.id_tipo,
            "tipo_consumo": self.tipo_consumo.serialize() if self.tipo_consumo else None,
            "foto_usuario": self.foto_usuario
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
        }

class Seguimiento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cantidad = db.Column(db.String(120), nullable=False)
    
    id_usuario = db.Column(db.Integer, db.ForeignKey('smoker_user.id'), nullable=False)  # Relación con SmokerUser
    usuario = db.relationship('SmokerUser', backref='seguimientos')

    id_tipo = db.Column(db.Integer, db.ForeignKey('tipos_consumo.id'), nullable=True)  # Relación con TiposConsumo
    tipo_consumo = db.relationship('TiposConsumo', backref='seguimientos')

    def __repr__(self):
        return f'<Seguimiento {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "cantidad": self.cantidad,
            "periodicidad":self.usuario.periodicidad,
            "id_usuario": self.id_usuario,
            "nombre_usuario":self.usuario.nombre_usuario,
            "id_tipo": self.id_tipo,
            "nombre_tipo":self.tipo_consumo.name,
            "numerocigarro_usuario": self.usuario.numerocigarro_usuario  # Obtienes el número desde la relación
        }

class Solicitud(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_user = db.Column(db.Integer, db.ForeignKey('smoker_user.id'), nullable=False)
    user = db.relationship('SmokerUser', backref='solicitudes')

    id_coach = db.Column(db.Integer, db.ForeignKey('coach.id'), nullable=True)
    coach = db.relationship('Coach', backref='solicitudes')

    fecha_solicitud = db.Column(db.DateTime, nullable=False)
    estado = db.Column(db.String(50), nullable=False)
    fecha_respuesta = db.Column(db.DateTime, nullable=True)
    comentarios = db.Column(db.Text, nullable=True)

    def __repr__(self):
        return f'<Solicitud {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "id_user": self.id_user,
            "name_user": self.user.nombre_usuario,  # Asegúrate que el campo es correcto en `SmokerUser`
            "id_coach": self.id_coach,
            "name_coach": self.coach.name_coach if self.coach else None,  # Manejo de nulos
            "fecha_solicitud": self.fecha_solicitud.isoformat(),
            "estado": self.estado,
            "fecha_respuesta": self.fecha_respuesta.isoformat() if self.fecha_respuesta else None,
            "comentarios": self.comentarios
        }
