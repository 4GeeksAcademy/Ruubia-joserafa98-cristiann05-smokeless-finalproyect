"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, session, jsonify, url_for, Blueprint
from api.models import db, SmokerUser, Coach, TiposConsumo, Seguimiento
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import datetime
import jwt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

api = Blueprint('api', __name__)


# Allow CORS requests to this API
CORS(api)

#USUARIOS
# Obtener todos los usuarios fumadores (GET)
@api.route('/smokers', methods=['GET'])
def get_all_smokers():
    # Devuelve todos los fumadores en formato JSON
    smokers = SmokerUser.query.all()
    return jsonify([smoker.serialize() for smoker in smokers]), 200

# Obtener un fumador por ID (GET)
@api.route('/smokers/<int:smoker_id>', methods=['GET'])
def get_smoker(smoker_id):
    # Busca un fumador por ID y devuelve su información
    smoker = SmokerUser.query.get(smoker_id)
    if smoker is None:
        return jsonify({"error": "Usuario no encontrado"}), 404
    return jsonify(smoker.serialize()), 200

# Ruta de Sign Up
@api.route('/signup', methods=['POST'])
def signup():
    email = request.json.get('email_usuario', None)
    password = request.json.get('password_email', None)

    if not email or not password:
        return jsonify({"msg": "Faltan email o password"}), 400

    # Verificar si el email ya está en uso
    existing_user = SmokerUser.query.filter_by(email_usuario=email).first()
    if existing_user:
        return jsonify({"msg": "El usuario ya existe"}), 400

    # Crear el nuevo usuario
    new_user = SmokerUser(
        email_usuario=email,
        password_email=password,
        nombre_usuario=None,  # Opcional
        genero_usuario=None,   # Opcional
        nacimiento_usuario=None,  # Opcional
        numero_cigarrillos=None,  # Opcional
        periodicidad_consumo=None,  # Opcional
        tiempo_fumando=None,  # Opcional
        id_tipo=None,  # Opcional
        foto_usuario=None  # Opcional
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado exitosamente"}), 201


# Ruta de Login
@api.route('/login', methods=['POST'])
def login():
    email = request.json.get('email_usuario')
    password = request.json.get('password_email')

    if not email or not password:
        return jsonify({"msg": "Faltan email o password"}), 400

    user = SmokerUser.query.filter_by(email_usuario=email).first()
    if user is None or user.password_email != password:
        return jsonify({"msg": "Credenciales inválidas"}), 401

    # Generar el token JWT
    token = create_access_token(identity=user.id)  # Usa create_access_token

    return jsonify({"msg": "Login exitoso", "token": token, "user_id": user.id}), 200


@api.route('/update_profile/<int:user_id>', methods=['PUT'])
def update_profile(user_id):
    # Obtener el usuario existente
    user = SmokerUser.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    # Obtener los datos del formulario
    nombre = request.json.get('nombre_usuario', None)
    genero = request.json.get('genero_usuario', None)
    cumpleaños = request.json.get('nacimiento_usuario', None)

    # Actualizar los campos sólo si no son None
    if nombre is not None:
        user.nombre_usuario = nombre
    if genero is not None:
        user.genero_usuario = genero
    if cumpleaños is not None:
        user.nacimiento_usuario = cumpleaños

    db.session.commit()

    return jsonify({"msg": "Perfil actualizado exitosamente!", "user": {
        "id": user.id,
        "nombre": user.nombre_usuario,
        "genero": user.genero_usuario,
        "cumpleaños": user.nacimiento_usuario
    }}), 200

@api.route('/update_consumo/<int:user_id>', methods=['PUT'])
def update_consumo(user_id):
    # Obtener el usuario existente
    user = SmokerUser.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    # Obtener los datos del formulario
    tipo_consumo = request.json.get('tipo_consumo', None)
    numero_cigarrillos = request.json.get('numero_cigarrillos', None)
    periodicidad_consumo = request.json.get('periodicidad_consumo', None)
    tiempo_fumando = request.json.get('tiempo_fumando', None)

    # Actualizar los campos sólo si no son None
    if tipo_consumo is not None:
        user.forma_consumo = tipo_consumo
    if numero_cigarrillos is not None:
        user.numero_cigarrillos = numero_cigarrillos
    if periodicidad_consumo is not None:
        user.periodicidad_consumo = periodicidad_consumo
    if tiempo_fumando is not None:
        user.tiempo_fumando = tiempo_fumando

    db.session.commit()

    return jsonify({
        "msg": "Datos de consumo actualizados exitosamente!",
        "user": {
            "id": user.id,
            "forma_consumo": user.forma_consumo,
            "numero_cigarrillos": user.numero_cigarrillos,
            "periodicidad_consumo": user.periodicidad_consumo,
            "tiempo_fumando": user.tiempo_fumando
        }
    }), 200

# CRUD COACHES
# Obtener todos los coaches (GET)
@api.route('/coaches', methods=['GET'])
def get_all_coaches():
    # Devuelve todos los coaches en formato JSON
    coaches = Coach.query.all()
    return jsonify([coach.serialize() for coach in coaches]), 200

# Obtener un coach por ID (GET)
@api.route('/coaches/<int:coach_id>', methods=['GET'])
def get_coach(coach_id):
    # Busca un coach por ID y devuelve su información
    coach = Coach.query.get(coach_id)
    if coach is None:
        return jsonify({"error": "Coach no encontrado"}), 404
    return jsonify(coach.serialize()), 200


 # signup coach
@api.route('/signup', methods=['POST'])
def signup_coach():
    email = request.json.get('email_coach', None)
    password = request.json.get('password_coach', None)

    if not email or not password:
        return jsonify({"msg": "Faltan email o password"}), 400

    # Verificar si el email ya está en uso
    existing_coach = Coach.query.filter_by(email_coach=email).first()
    if existing_coach:
        return jsonify({"msg": "El coach ya existe"}), 400

    # Crear el nuevo coach, aplicando hashing a la contraseña
    new_coach = Coach(
        email_coach=email,
        password_coach=password,  
        nombre_coach=None,  # Opcional
        genero_coach=None,   # Opcional
        direccion=None,  # Opcional
        latitud=None,  # Opcional
        longitud=None,  # Opcional
        descripcion_coach=None,  # Opcional
        foto_coach=None,  # Opcional
        precio_servicio=None  # Opcional
    )

    db.session.add(new_coach)
    db.session.commit()

    return jsonify({"msg": "Coach creado exitosamente"}), 201

 # login coach

@api.route('/login', methods=['POST'])
def login_coach():
    email = request.json.get('email_coach', None)
    password = request.json.get('password_coach', None)

    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    # Buscar el coach en la base de datos
    coach = Coach.query.filter_by(email_coach=email).first()
    if not coach:
        return jsonify({"msg": "Invalid credentials"}), 401

    # Verificar la contraseña directamente (esto no es seguro)
    if coach.password_coach != password:  # Compara directamente
        return jsonify({"msg": "Invalid credentials"}), 401
    
    return jsonify({"msg": "Login successful", "coach_id": coach.id}), 200


@api.route('/tiposconsumo', methods=['GET'])
def get_all_consuming():
    tiposconsumo = TiposConsumo.query.all()
    return jsonify([tiposconsumo.serialize() for tiposconsumo in tiposconsumo]), 200


@api.route('/tiposconsumo/<int:tiposconsumo_id>', methods=['GET'])
def get_consuming(consuming_id):
    tiposconsumo = TiposConsumo.query.get(consuming_id)
    if tiposconsumo is None:
        return jsonify({"error": "Usuario no encontrado"}), 404
    return jsonify(tiposconsumo.serialize()), 200

# Ruta protegida
@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()  # Obtiene el ID del usuario basado en el token JWT
    user = SmokerUser.query.get(current_user)  # Busca al usuario en la base de datos

    if user is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    return jsonify({
        "msg": "Acceso permitido",
        "user": {
            "id": user.id,
            "nombre_usuario": user.nombre_usuario,
            "email_usuario": user.email_usuario,
            "genero_usuario": user.genero_usuario,
            # Incluye otros campos que desees retornar
        }
    }), 200


# Endpoint para obtener la información del usuario (GET)
@api.route('/user_info/<int:user_id>', methods=['GET'])
def get_user_info(user_id):
    user = SmokerUser.query.get(user_id)
    
    if user is None:
        return jsonify({"error": "Usuario no encontrado"}), 404

    cumpleaños_usuario = user.nacimiento_usuario.strftime('%Y-%m-%d') if user.nacimiento_usuario else None

    return jsonify({
        "id": user.id,
        "nombre_usuario": user.nombre_usuario,
        "genero_usuario": user.genero_usuario,
        "cumpleaños_usuario": cumpleaños_usuario,
        "forma_consumo": user.forma_consumo,  
        "numero_cigarrillos": user.numero_cigarrillos,  # Asegúrate de que este es el nuevo nombre
        "periodicidad_consumo": user.periodicidad_consumo,
        "tiempo_fumando": user.tiempo_fumando
    }), 200



if __name__ == '__main__':
    app.run(debug=True)