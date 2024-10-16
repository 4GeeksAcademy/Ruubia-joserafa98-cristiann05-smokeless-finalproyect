from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, SmokerUser, Coach, TiposConsumo, Mensajes, Solicitud
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime 




from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, create_refresh_token, JWTManager

api = Blueprint('api', __name__)


# Allow CORS requests to this API
CORS(api)


# USUARIOS
# Obtener todos los usuarios fumadores (GET)
@api.route('/smoker', methods=['GET'])
def get_all_smoker():
    smokers = SmokerUser.query.all()
    return jsonify([smoker.serialize() for smoker in smokers]), 200

# Obtener un fumador por ID (GET)
@api.route('/smoker/<int:user_id>', methods=['GET'])
def get_smoker(user_id):
    smoker = SmokerUser.query.get(user_id)
    if smoker is None:
        return jsonify({"error": "Usuario no encontrado"}), 404
    return jsonify(smoker.serialize()), 200

@api.route('/smoker/<int:user_id>', methods=['PUT'])
def update_smoker(user_id):
    smoker = SmokerUser.query.get(user_id)
    if smoker is None:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Obtener los datos del cuerpo de la solicitud
    data = request.get_json()
    # Actualizar los campos del fumador
    smoker.nombre_usuario = data.get('nombre_usuario', smoker.nombre_usuario)
    smoker.genero_usuario = data.get('genero_usuario', smoker.genero_usuario)
    smoker.nacimiento_usuario = data.get('nacimiento_usuario', smoker.nacimiento_usuario)
    smoker.tiempo_fumando = data.get('tiempo_fumando', smoker.tiempo_fumando)
    smoker.numero_cigarrillos = data.get('numero_cigarrillos', smoker.numero_cigarrillos)
    smoker.periodicidad_consumo = data.get('periodicidad_consumo', smoker.periodicidad_consumo)

    # Guardar los cambios en la base de datos
    try:
        db.session.commit()
        return jsonify(smoker.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

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
        forma_consumo=None,
        public_id=None
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

    # Crear tokens
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify({
        "msg": "Login exitoso",
        "token": access_token,
        "refresh_token": refresh_token,
        "user_id": user.id
    }), 200

# Ruta para refrescar el token
@api.route('/refresh-token', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify(access_token=new_access_token), 200

@api.route("/api/smoker/<int:user_id>", methods=["GET"])
def get_smoker_profile(user_id):
    smoker = SmokerUser.query.get(user_id)
    if smoker is None:
        return jsonify({"error": "Smoker not found"}), 404

    return jsonify({
        "email_usuario": smoker.email_usuario,
        "nombre_usuario": smoker.nombre_usuario,
        "genero_usuario": smoker.genero_usuario,
        "nacimiento_usuario": smoker.nacimiento_usuario,
        "tiempo_fumando": smoker.tiempo_fumando,
        "numero_cigarrillos": smoker.numero_cigarrillos,
        "periodicidad_consumo": smoker.periodicidad_consumo,
        "public_id": smoker.public_id  # Aquí se devuelve la URL de la foto
    })

# Actualización de perfil de usuario
@api.route('/create_profile/<int:user_id>', methods=['PUT'])
def create_profile(user_id):
    user = SmokerUser.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    # Obtener datos del JSON
    nombre = request.json.get('nombre_usuario', None)
    genero = request.json.get('genero_usuario', None)
    cumpleaños = request.json.get('nacimiento_usuario', None)
    public_id = request.json.get('public_id', None)  # Añadir esta línea

    # Actualizar los campos del usuario si están presentes
    if nombre:
        user.nombre_usuario = nombre
    if genero:
        user.genero_usuario = genero
    if cumpleaños:
        user.nacimiento_usuario = datetime.strptime(cumpleaños, '%Y-%m-%d').date()
    if public_id:  # Actualiza public_id si está presente
        user.public_id = public_id  # Asegúrate de que el modelo tenga este campo definido

    # Guardar cambios en la base de datos
    db.session.commit()

    return jsonify({"msg": "Perfil actualizado exitosamente", "user": user.serialize()}), 200

@api.route('/create_config_profile/<int:user_id>', methods=['PUT'])
def update_consumo_profile(user_id):
    user = SmokerUser.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    forma_consumo_str = request.json.get('forma_consumo', None)
    numero_cigarrillos = request.json.get('numero_cigarrillos', None)
    periodicidad_consumo = request.json.get('periodicidad_consumo', None)
    tiempo_fumando = request.json.get('tiempo_fumando', None)
    print(f"Forma de consumo recibida: {forma_consumo_str}")
    if forma_consumo_str:
        tipo_consumo = TiposConsumo.query.filter_by(name=forma_consumo_str).first()
        print(f"Tipo de consumo encontrado: {tipo_consumo}")
        if tipo_consumo:
            user.forma_consumo = tipo_consumo.id
        else:
            return jsonify({"msg": "Tipo de consumo no encontrado"}), 404

    if numero_cigarrillos is not None:
        user.numero_cigarrillos = numero_cigarrillos
    if periodicidad_consumo:
        user.periodicidad_consumo = periodicidad_consumo
    if tiempo_fumando:
        user.tiempo_fumando = tiempo_fumando

    db.session.commit()

    return jsonify({"msg": "Datos de consumo actualizados exitosamente!", "user": user.serialize()}), 200

@api.route('/create_profile/coach/<int:coach_id>', methods=['PUT'])
def create_profile_coach(coach_id):
    coach = Coach.query.get(coach_id)
    if not coach:
        return jsonify({"msg": "Coach no encontrado"}), 404

    # Agrega log aquí para verificar los datos recibidos
    print("Datos recibidos:", request.json)  # Muestra los datos que se están recibiendo

    nombre = request.json.get('nombre_coach')
    genero = request.json.get('genero_coach')
    cumpleaños = request.json.get('nacimiento_coach')
    direccion = request.json.get('direccion')  # Nueva entrada para dirección
    latitud = request.json.get('latitud')  # Nueva entrada para latitud
    longitud = request.json.get('longitud')  # Nueva entrada para longitud

    if nombre:
        coach.nombre_coach = nombre
    if genero:
        coach.genero_coach = genero
    if cumpleaños:
        try:
            # Verifica que la fecha esté en el formato correcto
            coach.nacimiento_coach = datetime.strptime(cumpleaños, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"msg": "Fecha de nacimiento inválida. Debe estar en el formato YYYY-MM-DD."}), 400

    # Guardar dirección, latitud y longitud si están presentes
    if direccion:
        coach.direccion = direccion
    if latitud:
        try:
            coach.latitud = float(latitud)
        except ValueError:
            return jsonify({"msg": "Latitud inválida. Debe ser un número válido."}), 400
    if longitud:
        try:
            coach.longitud = float(longitud)
        except ValueError:
            return jsonify({"msg": "Longitud inválida. Debe ser un número válido."}), 400

    # Guarda los cambios en la base de datos
    db.session.commit()

    return jsonify({"msg": "Perfil del coach actualizado exitosamente", "coach": coach.serialize()}), 200



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

@api.route('/coaches/<int:coach_id>', methods=['PUT'])
def update_coach(coach_id):
    coach = Coach.query.get(coach_id)
    if coach is None:
        return jsonify({"error": "Coach no encontrado"}), 404
    
    data = request.get_json()
    
    # Verifica que los campos que deseas actualizar están en la solicitud
    if 'nombre_coach' in data:
        coach.nombre_coach = data['nombre_coach']
    if 'genero_coach' in data:
        coach.genero_coach = data['genero_coach']
    if 'nacimiento_coach' in data:
        coach.nacimiento_coach = data['nacimiento_coach']
    if 'direccion' in data:
        coach.direccion = data['direccion']
    if 'descripcion_coach' in data:
        coach.descripcion_coach = data['descripcion_coach']
    if 'precio_servicio' in data:
        coach.precio_servicio = data['precio_servicio']
    
    # Guarda los cambios en la base de datos
    db.session.commit()
    
    return jsonify(coach.serialize()), 200

# Ruta de Sign Up para coach
@api.route('/signup-coach', methods=['POST'])
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
        nacimiento_coach=None,
        direccion=None,
        latitud=None,
        longitud=None,
        descripcion_coach=None,
        public_id=None,
        precio_servicio=None
    )

    db.session.add(new_coach)
    db.session.commit()

    return jsonify({"msg": "Coach creado exitosamente", "coach_id": new_coach.id}), 201

@api.route('/login-coach', methods=['POST'])
def login_coach():
    email = request.json.get('email_coach', None)
    password = request.json.get('password_coach', None)

    if not email or not password:
        return jsonify({"msg": "Faltan email o password"}), 400

    # Busca al coach por email
    coach = Coach.query.filter_by(email_coach=email).first()
    if not coach or coach.password_coach != password:
        return jsonify({"msg": "Credenciales inválidas"}), 401
    
    # Generar un token
    token = create_access_token(identity=coach.id)

    return jsonify({
        "msg": "Login exitoso",
        "token": token,
        "coach_id": coach.id  # Mantener solo el coach_id en la respuesta
    }), 200

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

# Inicializa la aplicación Flask
def create_app():
    app = Flask(__name__)
    
    # Configuraciones de la aplicación
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Cambia esto a una clave secreta real

    db.init_app(app)
    jwt.init_app(app)  # Inicializa JWT

    # Registra los blueprints
    app.register_blueprint(api, url_prefix='/api')
    
    return app

# Obtener todas las solicitudes
@api.route('/solicitudes', methods=['GET'])
def get_all_solicitudes():
    solicitudes = Solicitud.query.all()  # Obtiene todas las solicitudes
    if not solicitudes:
        return jsonify({"message": "No hay solicitudes"}), 404

    return jsonify([solicitud.serialize() for solicitud in solicitudes]), 200

# Obtener solicitudes por usuario específico
@api.route('/solicitudes/usuario/<int:id_usuario>', methods=['GET'])
def get_solicitudes_by_user(id_usuario):
    solicitudes = Solicitud.query.filter_by(id_usuario=id_usuario).all()
    if not solicitudes:
        return jsonify({"message": "No hay solicitudes para este usuario"}), 404

    return jsonify([solicitud.serialize() for solicitud in solicitudes]), 200

# Crear una nueva solicitud
@api.route('/solicitudes', methods=['POST'])
def add_solicitud():
    data = request.get_json()

    required_fields = ['id_usuario', 'id_coach', 'fecha_solicitud', 'estado', 'comentarios']
    if not data or not all(key in data for key in required_fields):
        return jsonify({"error": "Datos incompletos"}), 400

    try:
        nueva_fecha_solicitud = datetime.strptime(data['fecha_solicitud'], "%d/%m/%Y").date()
        nueva_fecha_respuesta = datetime.strptime(data['fecha_respuesta'], "%d/%m/%Y").date() if data.get('fecha_respuesta') else None
        
        new_solicitud = Solicitud(
            id_usuario=data['id_usuario'],
            id_coach=data['id_coach'],
            fecha_solicitud=nueva_fecha_solicitud,
            estado=data['estado'] in ['true', 'True', '1'],  # Convertir a booleano
            fecha_respuesta=nueva_fecha_respuesta,
            comentarios=data['comentarios']
        )

        db.session.add(new_solicitud)
        db.session.commit()

        return jsonify(new_solicitud.serialize()), 201

    except ValueError:
        return jsonify({"error": "Formato de fecha inválido"}), 400

# Actualizar una solicitud específica
@api.route('/solicitudes/<int:id>', methods=['PUT'])
def update_solicitud(id):
    solicitud = Solicitud.query.get(id)
    if not solicitud:
        return jsonify({"error": "Solicitud no encontrada"}), 404

    data = request.get_json()

    # Actualización de los campos de la solicitud
    if 'estado' in data:
        solicitud.estado = data['estado']  # Asignar directamente el valor booleano
    if 'fecha_respuesta' in data:
        try:
            solicitud.fecha_respuesta = datetime.strptime(data['fecha_respuesta'], "%d/%m/%Y").date()
        except ValueError:
            return jsonify({"error": "Formato de fecha de respuesta inválido"}), 400
    if 'comentarios' in data:
        solicitud.comentarios = data['comentarios']

    db.session.commit()
    return jsonify(solicitud.serialize()), 200


# Eliminar una solicitud específica
@api.route('/solicitudes/<int:id>', methods=['DELETE'])
def delete_solicitud(id):
    solicitud = Solicitud.query.get(id)
    if not solicitud:
        return jsonify({"error": "Solicitud no encontrada"}), 404

    db.session.delete(solicitud)
    db.session.commit()
    return jsonify({"message": "Solicitud eliminada exitosamente"}), 200

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
        "user": user.serialize()  # Asegúrate de que tu modelo tenga un método serialize() que devuelva los datos necesarios
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
    
@api.route('/coach_info/<int:coach_id>', methods=['GET'])
def get_coach_info(coach_id):
    try:
        coach = Coach.query.get(coach_id)  # Obtiene el coach por ID
        if not coach:
            return jsonify({"error": "Coach no encontrado"}), 404  # Maneja el caso de no encontrado

        return jsonify(coach.serialize()), 200  # Retorna la información del coach
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Maneja cualquier excepción


# MENSAJES USUARIO Y COACH 
@api.route('/mensajes', methods=['GET'])
@jwt_required()  # Se requiere autenticación JWT
def get_all_mensajes():
    mensajes = Mensajes.query.all()
    return jsonify([mensaje.serialize() for mensaje in mensajes]), 200

@api.route('/mensajes/<int:user_id>/<int:coach_id>', methods=['GET'])
@jwt_required()  # Se requiere autenticación JWT
def get_mensajes_by_user_and_coach(user_id, coach_id):
    mensajes = Mensajes.query.filter(
        (Mensajes.id_usuario == user_id) & (Mensajes.id_coach == coach_id)
    ).all()
    if not mensajes:
        return jsonify({"error": "No se encontraron mensajes"}), 404
    return jsonify([mensaje.serialize() for mensaje in mensajes]), 200

@api.route('/mensajes', methods=['POST'])
@jwt_required()  # Se requiere autenticación JWT
def create_mensaje():
    body = request.get_json()

    # Validaciones
    if not body.get('id_usuario') and not body.get('id_coach'):
        return jsonify({"error": "Debe proporcionar id_usuario o id_coach"}), 400

    if not body.get('contenido'):
        return jsonify({"error": "El contenido del mensaje no puede estar vacío"}), 400

    # Crear un nuevo mensaje
    nuevo_mensaje = Mensajes(
        id_usuario=body.get('id_usuario'),
        id_coach=body.get('id_coach'),
        contenido=body.get('contenido'),
        fecha_envio=datetime.utcnow()
    )

    db.session.add(nuevo_mensaje)
    db.session.commit()

    return jsonify(nuevo_mensaje.serialize()), 201

@api.route('/mensajes/<int:mensaje_id>', methods=['PUT'])
@jwt_required()  # Se requiere autenticación JWT
def update_mensaje(mensaje_id):
    mensaje = Mensajes.query.get(mensaje_id)
    if mensaje is None:
        return jsonify({"error": "Mensaje no encontrado"}), 404

    body = request.get_json()

    # Actualizar el contenido o el estado de visto
    if 'contenido' in body:
        mensaje.contenido = body['contenido']
    if 'visto' in body:
        mensaje.visto = body['visto']

    db.session.commit()

    return jsonify(mensaje.serialize()), 200

@api.route('/mensajes/<int:mensaje_id>', methods=['DELETE'])
@jwt_required()  # Se requiere autenticación JWT
def delete_mensaje(mensaje_id):
    mensaje = Mensajes.query.get(mensaje_id)
    if mensaje is None:
        return jsonify({"error": "Mensaje no encontrado"}), 404

    db.session.delete(mensaje)
    db.session.commit()

    return jsonify({"message": "Mensaje eliminado correctamente"}), 200

@api.route('/mensajes/offline/<int:coach_id>', methods=['GET'])
@jwt_required()
def get_mensajes_offline(coach_id):
    # Obtén todos los mensajes donde el id_coach coincida
    mensajes = Mensajes.query.filter(Mensajes.id_coach == coach_id, Mensajes.visto == False).all()
    
    # Devuelve los mensajes que no han sido vistos
    return jsonify([mensaje.serialize() for mensaje in mensajes]), 200

    
if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()  # Crea las tablas de la base de datos
    app.run(debug=True)


