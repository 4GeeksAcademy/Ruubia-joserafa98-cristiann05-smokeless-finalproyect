from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, SmokerUser, Coach, TiposConsumo, Mensajes, Solicitud
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime
from cloudinary_config import cloudinary
import jwt
from datetime import date

from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager

api = Blueprint('api', __name__)
coaches_bp = Blueprint('coaches', __name__)

# Allow CORS requests to this API
CORS(api)

# USUARIOS
# Obtener todos los usuarios fumadores (GET)
@api.route('/smokers', methods=['GET'])
def get_all_smokers():
    smokers = SmokerUser.query.all()
    return jsonify([smoker.serialize() for smoker in smokers]), 200

# Obtener un fumador por ID (GET)
@api.route('/smokers/<int:smoker_id>', methods=['GET'])
def get_smoker(smoker_id):
    smoker = SmokerUser.query.get(smoker_id)
    if smoker is None:
        return jsonify({"error": "Usuario no encontrado"}), 404
    return jsonify(smoker.serialize()), 200

# Ruta de Sign Up
@api.route('/signup-smoker', methods=['POST'])
def signup():
    email = request.json.get('email_usuario', None)
    password = request.json.get('password_email', None)

    if not email or not password:
        return jsonify({"msg": "Faltan email o password"}), 400

    existing_user = SmokerUser.query.filter_by(email_usuario=email).first()
    if existing_user:
        return jsonify({"msg": "El usuario ya existe"}), 400

    new_user = SmokerUser(
        email_usuario=email,
        password_email=password,
        nombre_usuario=None,
        genero_usuario=None,
        nacimiento_usuario=None,
        numero_cigarrillos=None,
        periodicidad_consumo=None,
        tiempo_fumando=None,
        id_tipo=None,
        foto_usuario=None
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado exitosamente", "user_id": new_user.id}), 201

# Ruta de Login
@api.route('/login-smoker', methods=['POST'])
def login():
    email = request.json.get('email_usuario')
    password = request.json.get('password_email')

    if not email or not password:
        return jsonify({"msg": "Faltan email o password"}), 400

    user = SmokerUser.query.filter_by(email_usuario=email).first()
    if user is None or user.password_email != password:
        return jsonify({"msg": "Credenciales inválidas"}), 401

    token = create_access_token(identity=user.id)

    return jsonify({"msg": "Login exitoso", "token": token, "user_id": user.id}), 200

# Actualización de perfil de usuario
@api.route('/create_profile/<int:user_id>', methods=['PUT'])
def create_profile(user_id):
    user = SmokerUser.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    nombre = request.json.get('nombre_usuario', None)
    genero = request.json.get('genero_usuario', None)
    cumpleaños = request.json.get('nacimiento_usuario', None)

    if nombre:
        user.nombre_usuario = nombre
    if genero:
        user.genero_usuario = genero
    if cumpleaños:
        user.nacimiento_usuario = datetime.strptime(cumpleaños, '%Y-%m-%d').date()

    db.session.commit()

    return jsonify({"msg": "Perfil actualizado exitosamente", "user": user.serialize()}), 200

# Actualización del consumo de tabaco del usuario
@api.route('/create_config_profile/<int:user_id>', methods=['PUT'])
def update_consumo(user_id):
    user = SmokerUser.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    tipo_consumo = request.json.get('tipo_consumo', None)
    numero_cigarrillos = request.json.get('numero_cigarrillos', None)
    periodicidad_consumo = request.json.get('periodicidad_consumo', None)
    tiempo_fumando = request.json.get('tiempo_fumando', None)

    if tipo_consumo:
        user.forma_consumo = tipo_consumo
    if numero_cigarrillos:
        user.numero_cigarrillos = numero_cigarrillos
    if periodicidad_consumo:
        user.periodicidad_consumo = periodicidad_consumo
    if tiempo_fumando:
        user.tiempo_fumando = tiempo_fumando

    db.session.commit()

    return jsonify({"msg": "Datos de consumo actualizados exitosamente!", "user": user.serialize()}), 200

# Obtener todos los coaches (GET)
@api.route('/coaches', methods=['GET'])
def get_all_coaches():
    coaches = Coach.query.all()
    return jsonify([coach.serialize() for coach in coaches]), 200

# Obtener un coach por ID (GET)
@api.route('/coaches/<int:coach_id>', methods=['GET'])
def get_coach(coach_id):
    coach = Coach.query.get(coach_id)
    if coach is None:
        return jsonify({"error": "Coach no encontrado"}), 404
    return jsonify(coach.serialize()), 200

# Ruta de Sign Up para coach
@api.route('/signup/coach', methods=['POST'])
def signup_coach():
    email = request.json.get('email_coach', None)
    password = request.json.get('password_coach', None)

    if not email or not password:
        return jsonify({"msg": "Faltan email o password"}), 400

    existing_coach = Coach.query.filter_by(email_coach=email).first()
    if existing_coach:
        return jsonify({"msg": "El coach ya existe"}), 400

    new_coach = Coach(
        email_coach=email,
        password_coach=password,
        nombre_coach=None,
        genero_coach=None,
        direccion=None,
        latitud=None,
        longitud=None,
        descripcion_coach=None,
        foto_coach=None,
        precio_servicio=None
    )

    db.session.add(new_coach)
    db.session.commit()

    return jsonify({"msg": "Coach creado exitosamente", "coach_id": new_coach.id}), 201

# Ruta de Login para coach
@api.route('/login/coach', methods=['POST'])
def login_coach():
    email = request.json.get('email_coach', None)
    password = request.json.get('password_coach', None)

    if not email or not password:
        return jsonify({"msg": "Faltan email o password"}), 400

    coach = Coach.query.filter_by(email_coach=email).first()
    if not coach or coach.password_coach != password:
        return jsonify({"msg": "Credenciales inválidas"}), 401
    
    return jsonify({"msg": "Login exitoso", "coach_id": coach.id}), 200

# Obtener tipos de consumo (GET)
@api.route('/tiposconsumo', methods=['GET'])
def get_all_consuming():
    tiposconsumo = TiposConsumo.query.all()
    return jsonify([tipo.serialize() for tipo in tiposconsumo]), 200

# Obtener tipo de consumo por ID (GET)
@api.route('/tiposconsumo/<int:tiposconsumo_id>', methods=['GET'])
def get_consuming(tiposconsumo_id):
    tiposconsumo = TiposConsumo.query.get(tiposconsumo_id)
    if tiposconsumo is None:
        return jsonify({"error": "Tipo de consumo no encontrado"}), 404
    return jsonify(tiposconsumo.serialize()), 200

# Ruta protegida con JWT
@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    user = SmokerUser.query.get(current_user)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    return jsonify({
        "msg": "Acceso permitido",
        "user": user.serialize()
    }), 200

# Obtener la información de un usuario por ID (GET)
@api.route('/user_info/<int:user_id>', methods=['GET'])
def get_user_info(user_id):
    try:
        user = SmokerUser.query.get(user_id)
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        return jsonify(user.serialize()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

