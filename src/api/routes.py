"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, SmokerUser, Coach, TiposConsumo, Seguimiento
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime


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

# Crear un nuevo fumador (POST)
@api.route('/smokers', methods=['POST'])
def create_smoker():
    data = request.get_json()
    
    required_fields = ['email_usuario', 'password_email', 'nombre_usuario', 'genero_usuario', 
                       'nacimiento_usuario', 'numerocigarro_usuario', 'periodicidad', 
                       'tiempo_fumando', 'id_tipo']
    if not data or not all(key in data for key in required_fields):
        return jsonify({"error": "Datos incompletos"}), 400

    # Verifica si el email ya está en uso
    existing_smoker = SmokerUser.query.filter_by(email_usuario=data['email_usuario']).first()
    if existing_smoker:
        return jsonify({"error": "El email ya está en uso"}), 400

    try:
        nacimiento = datetime.strptime(data['nacimiento_usuario'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({"error": "Formato de fecha incorrecto, usa YYYY-MM-DD"}), 400

    new_smoker = SmokerUser(
        email_usuario=data['email_usuario'],
        password_email=data['password_email'],
        nombre_usuario=data['nombre_usuario'],
        genero_usuario=data['genero_usuario'],
        nacimiento_usuario=nacimiento,
        numerocigarro_usuario=data['numerocigarro_usuario'],
        periodicidad=data['periodicidad'],
        tiempo_fumando=data['tiempo_fumando'],
        id_tipo=data['id_tipo'],
        foto_usuario=data.get('foto_usuario')
    )
    
    db.session.add(new_smoker)
    db.session.commit()
    return jsonify(new_smoker.serialize()), 201

# Actualizar un fumador existente (PUT)
@api.route('/smokers/<int:smoker_id>', methods=['PUT'])
def update_smoker(smoker_id):
    smoker = SmokerUser.query.get(smoker_id)
    if smoker is None:
        return jsonify({"error": "Usuario no encontrado"}), 404

    data = request.get_json()
    # Actualiza los atributos del fumador con los nuevos datos
    smoker.email_usuario = data.get('email_usuario', smoker.email_usuario)
    smoker.password_email = data.get('password_email', smoker.password_email)
    smoker.nombre_usuario = data.get('nombre_usuario', smoker.nombre_usuario)
    smoker.genero_usuario = data.get('genero_usuario', smoker.genero_usuario)
    smoker.nacimiento_usuario = datetime.strptime(data['nacimiento_usuario'], '%Y-%m-%d').date() if 'nacimiento_usuario' in data else smoker.nacimiento_usuario
    smoker.numerocigarro_usuario = data.get('numerocigarro_usuario', smoker.numerocigarro_usuario)
    smoker.periodicidad = data.get('periodicidad', smoker.periodicidad)
    smoker.tiempo_fumando = data.get('tiempo_fumando', smoker.tiempo_fumando)
    smoker.id_tipo = data.get('id_tipo', smoker.id_tipo)
    smoker.foto_usuario = data.get('foto_usuario', smoker.foto_usuario)

    db.session.commit()
    return jsonify(smoker.serialize()), 200

# Eliminar un fumador (DELETE)
@api.route('/smokers/<int:smoker_id>', methods=['DELETE'])
def delete_smoker(smoker_id):
    smoker = SmokerUser.query.get(smoker_id)
    if smoker is None:
        return jsonify({"error": "Usuario no encontrado"}), 404

    db.session.delete(smoker)
    db.session.commit()
    return jsonify({"message": "Usuario eliminado correctamente"}), 200

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

    # Crear el nuevo usuario, aplicando hashing a la contraseña
    new_user = SmokerUser(
        email_usuario=email,
        password_email=password,
        nombre_usuario=None,  # Opcional
        genero_usuario=None,   # Opcional
        nacimiento_usuario=None,  # Opcional
        numerocigarro_usuario=None,  # Opcional
        periodicidad=None,  # Opcional
        tiempo_fumando=None,  # Opcional
        id_tipo=None,  # Opcional
        foto_usuario=None  # Opcional
    )

    db.session.add(new_user)
    db.session.commit()

    seguimiento_data = {
        'cantidad': '0',  # Puedes establecer un valor inicial
        'id_usuario': new_user.id,
        'id_tipo': None  # O el ID de tipo que quieras asignar
    }

    # Agregar el seguimiento a la base de datos
    new_following = Seguimiento(
        cantidad=seguimiento_data['cantidad'],
        id_usuario=seguimiento_data['id_usuario'],
        id_tipo=seguimiento_data['id_tipo']
    )

    db.session.add(new_following)
    db.session.commit()

    return jsonify({"msg": "Usuario creado exitosamente", "following": new_following.serialize()}), 201


@api.route('/login', methods=['POST'])
def login():
    email = request.json.get('email_usuario', None)
    password = request.json.get('password_email', None)

    if not email or not password:
        return jsonify({"msg": "Faltan email o password"}), 400

    user = SmokerUser.query.filter_by(email_usuario=email).first()
    if not user:
        return jsonify({"msg": "Credenciales inválidas"}), 401
    if user.password_email != password:
        return jsonify({"msg": "Credenciales inválidas"}), 401    

   
    seguimientos = Seguimiento.query.filter_by(id_usuario=user.id).all()

    return jsonify({
        "msg": "Login exitoso",
        "user_id": user.id,
        "nombre_usuario": user.nombre_usuario,
        "seguimientos": [s.serialize() for s in seguimientos], 
        "foto_usuario": user.foto_usuario
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

# Crear un nuevo coach (POST)
# Crear un nuevo coach (POST)
@api.route('/coaches', methods=['POST'])
def create_coach():
    data = request.get_json()

    # Verifica que se reciban todos los campos obligatorios
    required_fields = ['email_coach', 'password_coach', 'nombre_coach', 'genero_coach', 'direccion', 'latitud', 'longitud', 'descripcion_coach', 'precio_servicio']
    if not data or not all(key in data for key in required_fields):
        return jsonify({"error": "Datos incompletos"}), 400

    # Crea un nuevo objeto Coach y lo guarda en la base de datos
    new_coach = Coach(
        email_coach=data['email_coach'],
        password_coach=data['password_coach'],  # Considera usar hash para contraseñas
        nombre_coach=data['nombre_coach'],
        genero_coach=data['genero_coach'],
        direccion=data['direccion'],
        latitud=data['latitud'],
        longitud=data['longitud'],
        descripcion_coach=data['descripcion_coach'],
        foto_coach=data.get('foto_coach'),  # Opcional
        precio_servicio=data['precio_servicio']
    )

    db.session.add(new_coach)
    db.session.commit()
    return jsonify(new_coach.serialize()), 201


# Actualizar un coach existente (PUT)
@api.route('/coaches/<int:coach_id>', methods=['PUT'])
def update_coach(coach_id):
    coach = Coach.query.get(coach_id)
    if coach is None:
        return jsonify({"error": "Coach no encontrado"}), 404

    data = request.get_json()

    # Actualiza los atributos del coach con los nuevos datos
    coach.email_coach = data.get('email_coach', coach.email_coach)
    coach.password_coach = data.get('password_coach', coach.password_coach)  # Considera el hash
    coach.nombre_coach = data.get('nombre_coach', coach.nombre_coach)
    coach.genero_coach = data.get('genero_coach', coach.genero_coach)
    coach.direccion = data.get('direccion', coach.direccion)
    coach.latitud = data.get('latitud', coach.latitud)
    coach.longitud = data.get('longitud', coach.longitud)
    coach.descripcion_coach = data.get('descripcion_coach', coach.descripcion_coach)
    coach.foto_coach = data.get('foto_coach', coach.foto_coach)
    coach.precio_servicio = data.get('precio_servicio', coach.precio_servicio)

    db.session.commit()
    return jsonify(coach.serialize()), 200


# Eliminar un coach (DELETE)
@api.route('/coaches/<int:coach_id>', methods=['DELETE'])
def delete_coach(coach_id):
    coach = Coach.query.get(coach_id)
    if coach is None:
        return jsonify({"error": "Coach no encontrado"}), 404

    db.session.delete(coach)
    db.session.commit()
    return jsonify({"message": "Coach eliminado correctamente"}), 200


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

@api.route('/tiposconsumo', methods=['POST'])
def add_consuming():
    data = request.get_json()

    required_fields = ['name'] 
    if not data or not all(key in data for key in required_fields):
        return jsonify({"error": "Datos incompletos"}), 400

    new_type = TiposConsumo(name=data['name'])

    db.session.add(new_type)
    db.session.commit()
    
    return jsonify(new_type.serialize()), 201

@api.route('/tiposconsumo/<int:id>', methods=['PUT'])
def update_consuming(id):
    data = request.get_json()

    tipo_consumo = TiposConsumo.query.get(id)
    if not tipo_consumo:
        return jsonify({"error": "Tipo de consumo no encontrado"}), 404

    if 'name' in data:
        tipo_consumo.name = data['name']

    db.session.commit()
    return jsonify(tipo_consumo.serialize()), 200

@api.route('/tiposconsumo/<int:id>', methods=['DELETE'])
def delete_consuming(id):
    tiposconsumo = TiposConsumo.query.get(id)
    if tiposconsumo is None:
        return jsonify({"error": "Usuario no encontrado"}), 404

    db.session.delete(tiposconsumo)
    db.session.commit()
    return jsonify({"message": "consumo eliminado correctamente"}), 200
 
 # RUTAS PARA JOSE
@api.route('/seguimiento', methods=['GET'])
def get_all_following():
    user_id = request.args.get('user_id')  
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400  

    try:
        user_id = int(user_id) 
    except ValueError:
        return jsonify({"error": "Invalid user_id format"}), 422

    following = Seguimiento.query.filter_by(id_usuario=user_id).all()

    print(f"Seguimientos obtenidos para user_id {user_id}: {following}") 

    if not following:
        return jsonify({"error": "No followings found"}), 404 

    return jsonify([f.serialize() for f in following]), 200 




@api.route('/seguimiento/<int:seguimiento_id>', methods=['GET'])
def get_following(following_id):
    following = Seguimiento.query.get(following_id)
    if following is None:
        return jsonify({"error": "Seguimiento no encontrado"}), 404
    return jsonify(following.serialize()), 200

@api.route('/seguimiento', methods=['POST'])
def add_following():
    data = request.get_json()

    required_fields = ['cantidad', 'id_usuario', 'id_tipo']
    if not data or not all(key in data for key in required_fields):
        return jsonify({"error": "Datos incompletos"}), 400

    new_following = Seguimiento(
        cantidad=data['cantidad'],
        id_usuario=data['id_usuario'],
        id_tipo=data['id_tipo']
    )

    db.session.add(new_following)
    db.session.commit()
    
    return jsonify(new_following.serialize()), 201


@api.route('/seguimiento/<int:id>', methods=['PUT'])
def update_following(id):
    data = request.get_json()

    following = Seguimiento.query.get(id)
    if not following:
        return jsonify({"error": "Seguimiento no encontrado"}), 404

    if 'cantidad' in data:
        following.cantidad = data['cantidad']
    if 'id_usuario' in data:
        following.id_usuario = data['id_usuario']
    if 'id_tipo' in data:
        following.id_tipo = data['id_tipo']

    db.session.commit()
    return jsonify(following.serialize()), 200


# Ruta protegida
@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Obtenemos la identidad del usuario actual usando el token JWT
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

if __name__ == '__main__':
    app.run(debug=True)