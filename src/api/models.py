from flask_sqlalchemy import SQLAlchemy
from datetime import date

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
    tiempo_fumando = db.Column(db.String(10), nullable=True)  # Opcional
    id_tipo = db.Column(db.Integer, db.ForeignKey('tipos_consumo.id'), nullable=True)  # Relación con TiposConsumo
    tipo_consumo = db.relationship('TiposConsumo', backref='smokers')
    foto_usuario = db.Column(db.String(255), nullable=True)  # Opcional
    forma_consumo = db.Column(db.String(50), default='cigarros')  # Tipo de consumo por defecto
    numero_cigarrillos = db.Column(db.Integer, nullable=True)  # Cantidad de cigarrillos
    periodicidad_consumo = db.Column(db.String(20), nullable=True)  # Diaria, semanal, mensual o anual

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
            "id_tipo": self.id_tipo,
            "tipo_consumo": self.tipo_consumo.serialize() if self.tipo_consumo else None,
            "foto_usuario": self.foto_usuario,
            "forma_consumo": self.forma_consumo,
            "numero_cigarrillos": self.numero_cigarrillos,
            "periodicidad_consumo": self.periodicidad_consumo,
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
    __tablename__ = 'seguimiento'  # Asegúrate de que este es el nombre correcto de la tabla en la base de datos
    id = db.Column(db.Integer, primary_key=True)
    cantidad = db.Column(db.String(120), nullable=False)
    
    id_usuario = db.Column(db.Integer, db.ForeignKey('smoker_user.id'), nullable=False)  # Relación con SmokerUser
    usuario = db.relationship('SmokerUser', backref='seguimientos')  # Relación inversa

    id_tipo = db.Column(db.Integer, db.ForeignKey('tipos_consumo.id'), nullable=True)  # Relación con TiposConsumo
    tipo_consumo = db.relationship('TiposConsumo', backref='seguimientos')  # Relación inversa

    # Añadiendo fecha de inicio
    fecha_inicio_usuario = db.Column(db.Date, nullable=False)  # Campo para almacenar la fecha

    def __repr__(self):
        return f'<Seguimiento {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "cantidad": self.cantidad,
            "id_usuario": self.id_usuario,
            "nombre_usuario": self.usuario.nombre_usuario if self.usuario else None,
            "id_tipo": self.id_tipo,
            "nombre_tipo": self.tipo_consumo.name if self.tipo_consumo else None,
            "fecha_inicio_usuario": self.fecha_inicio_usuario.isoformat()  # Convertir a formato ISO
        }