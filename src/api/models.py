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
        }