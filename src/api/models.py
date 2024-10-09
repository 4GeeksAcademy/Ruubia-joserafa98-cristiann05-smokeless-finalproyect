from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Coach(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email_coach = db.Column(db.String(120), unique=True, nullable=False)
    password_coach = db.Column(db.String(128), nullable=False)
    nombre_coach = db.Column(db.String(50), nullable=True)  # Cambiado a opcional
    genero_coach = db.Column(db.String(10), nullable=True)  # Cambiado a opcional
    nacimiento_coach = db.Column(db.Date, nullable=True)  # Opcional
    direccion = db.Column(db.String(200), nullable=True)  # Cambiado a opcional
    latitud = db.Column(db.Float, nullable=True)  # Cambiado a opcional
    longitud = db.Column(db.Float, nullable=True)  # Cambiado a opcional
    descripcion_coach = db.Column(db.Text, nullable=True)  # Cambiado a opcional
    foto_coach = db.Column(db.String(200), nullable=True)  # Cambiado a opcional
    public_id = db.Column(db.String(200), nullable=True)  # Cambiado a opcional
    precio_servicio = db.Column(db.Float, nullable=True)  # Cambiado a opcional

    def __repr__(self):
        return f'<Coach {self.email_coach}>'
    
    def serialize(self):
        return {
        "id": self.id,
        "email_coach": self.email_coach,
        "nombre_coach": self.nombre_coach,
        "genero_coach": self.genero_coach,
        "nacimiento_coach": self.nacimiento_coach.isoformat() if self.nacimiento_coach else None,  # Asegúrate de serializarlo correctamente
        "direccion": self.direccion,
        "latitud": self.latitud,
        "longitud": self.longitud,
        "descripcion_coach": self.descripcion_coach,
        "foto_coach": self.foto_coach,
        "public_id": self.public_id,
        "precio_servicio": self.precio_servicio,
    }


class SmokerUser(db.Model):
    __tablename__ = 'smoker_user'
    id = db.Column(db.Integer, primary_key=True)
    email_usuario = db.Column(db.String(120), unique=True, nullable=False)
    password_email = db.Column(db.String(80), nullable=False)
    nombre_usuario = db.Column(db.String(80), nullable=True)  # Opcional
    genero_usuario = db.Column(db.String(10), nullable=True)  # Opcional
    nacimiento_usuario = db.Column(db.Date, nullable=True)  # Opcional
    tiempo_fumando = db.Column(db.String(10), nullable=True)  # Opcional
    forma_consumo = db.Column(db.Integer, db.ForeignKey('tipos_consumo.id'), nullable=True)  # ID del tipo de consumo
    foto_usuario = db.Column(db.String(255), nullable=True)  # Opcional
    numero_cigarrillos = db.Column(db.Integer, nullable=True)  # Cantidad de cigarrillos
    periodicidad_consumo = db.Column(db.String(20), nullable=True)  # Diaria, semanal, mensual o anual
    public_id = db.Column(db.String(200), nullable=True)  # Opcional

    def __repr__(self):
        return f'<SmokerUser {self.email_usuario}>'

    def serialize(self):
        return {
            "id": self.id,
            "email_usuario": self.email_usuario,
            "nombre_usuario": self.nombre_usuario,
            "genero_usuario": self.genero_usuario,
            "nacimiento_usuario": self.nacimiento_usuario.isoformat() if self.nacimiento_usuario else None,
            "tiempo_fumando": self.tiempo_fumando,
            "forma_consumo": self.forma_consumo,  # ID del tipo de consumo
            "foto_usuario": self.foto_usuario,
            "numero_cigarrillos": self.numero_cigarrillos,
            "periodicidad_consumo": self.periodicidad_consumo,
            "public_id": self.public_id
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

class Solicitud(db.Model):
    __tablename__ = 'solicitudes'

    id = db.Column(db.Integer, primary_key=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('smoker_user.id'), nullable=False)
    user = db.relationship('SmokerUser', backref='solicitudes', lazy=True)

    id_coach = db.Column(db.Integer, db.ForeignKey('coach.id'), nullable=True)
    coach = db.relationship('Coach', backref='solicitudes', lazy=True)

    fecha_solicitud = db.Column(db.Date, nullable=False)  # Cambiado a Date
    estado = db.Column(db.Boolean, nullable=False)  # Cambiado a Boolean
    fecha_respuesta = db.Column(db.Date, nullable=True)  # Cambiado a Date
    comentarios = db.Column(db.String, nullable=True)  # Cambiado a String

    def __repr__(self):
        return f'<Solicitud {self.id}, Usuario: {self.id_usuario}, Coach: {self.id_coach}>'

    def serialize(self):
        return {
            "id": self.id,
            "id_usuario": self.id_usuario,
            "nombre_usuario": self.user.nombre_usuario, 
            "id_coach": self.id_coach,
            "nombre_coach": self.coach.nombre_coach if self.coach else None,
            "fecha_solicitud": self.fecha_solicitud.strftime("%d/%m/%Y") if self.fecha_solicitud else None,
            "estado": self.estado,
            "fecha_respuesta": self.fecha_respuesta.strftime("%d/%m/%Y") if self.fecha_respuesta else None,
            "comentarios": self.comentarios
        }



class Mensajes(db.Model):
    __tablename__ = 'mensajes'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Relación con el usuario que envía el mensaje
    id_usuario = db.Column(db.Integer, db.ForeignKey('smoker_user.id'), nullable=True)  # Puede ser nulo si el coach envía el mensaje
    usuario = db.relationship('SmokerUser', foreign_keys=[id_usuario])

    # Relación con el coach que envía el mensaje
    id_coach = db.Column(db.Integer, db.ForeignKey('coach.id'), nullable=True)  # Puede ser nulo si el usuario envía el mensaje
    coach = db.relationship('Coach', foreign_keys=[id_coach])

    contenido = db.Column(db.String, nullable=False)
    fecha_envio = db.Column(db.DateTime, default=datetime.utcnow)
    visto = db.Column(db.Boolean, default=False)

    def serialize(self):
        return {
            'id': self.id,
            'id_usuario': self.id_usuario,
            'id_coach': self.id_coach,
            'contenido': self.contenido,
            'fecha_envio': self.fecha_envio.strftime("%d/%m/%Y %H:%M:%S"),
            'visto': self.visto
        }