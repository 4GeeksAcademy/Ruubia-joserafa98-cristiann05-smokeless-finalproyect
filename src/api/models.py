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
