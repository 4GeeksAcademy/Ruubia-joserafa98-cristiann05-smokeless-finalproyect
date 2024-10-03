"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, SmokerUser, Coach, TiposConsumo, Seguimiento, Mensajes
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime
from cloudinary_config import cloudinary

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

api = Blueprint('api', __name__)
coaches_bp = Blueprint('coaches', __name__)

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

    # Crear el nuevo usuario
    new_user = SmokerUser(
        email_usuario=email,
        password_email=password
    )

    db.session.add(new_user)
    db.session.commit()

    # Crear un seguimiento inicial (esto asume que tienes un id_tipo para el seguimiento)
    initial_following = Seguimiento(
        cantidad=0,  # O el valor que consideres inicial
        id_usuario=new_user.id,
        id_tipo=None  # O el id_tipo que quieras asignar
    )
    
    db.session.add(initial_following)
    db.session.commit()

    return jsonify({"msg": "Usuario creado exitosamente", "user_id": new_user.id}), 201



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
@api.route('/signup/coach', methods=['POST'])
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

@api.route('/login/coach', methods=['POST'])
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
    print(f"Recibiendo user_id: {user_id}")  # Agregar esta línea para depuración
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

@api.route('/solicitudes', methods=['POST'])
def add_solicitud():
    data = request.get_json()
    
    required_fields = ['id_user', 'id_coach', 'fecha_solicitud', 'estado', 'comentarios']
    if not data or not all(key in data for key in required_fields):
        return jsonify({"error": "Datos incompletos"}), 400

    new_solicitud = Solicitud(
        id_user=data['id_user'],
        id_coach=data['id_coach'],
        fecha_solicitud=data['fecha_solicitud'],
        estado=data['estado'],
        comentarios=data['comentarios']
    )

    db.session.add(new_solicitud)
    db.session.commit()
    
    return jsonify(new_solicitud.serialize()), 201


@api.route('/solicitudes', methods=['GET'])
def get_all_solicitudes():
    solicitudes = Solicitud.query.all()  # Obtiene todas las solicitudes
    if not solicitudes:
        return jsonify({"message": "No hay solicitudes"}), 404

    return jsonify([solicitud.serialize() for solicitud in solicitudes]), 200

@api.route('/solicitudes/<int:id_user>', methods=['GET'])
def get_solicitudes_by_user(id_user):
    solicitudes = Solicitud.query.filter_by(id_user=id_user).all()
    if not solicitudes:
        return jsonify({"message": "No hay solicitudes"}), 404

    return jsonify([solicitud.serialize() for solicitud in solicitudes]), 200

@api.route('/solicitudes/<int:id>', methods=['PUT'])
def update_solicitud(id):
    solicitud = Solicitud.query.get(id)
    if not solicitud:
        return jsonify({"error": "Solicitud no encontrada"}), 404

    data = request.get_json()
    if 'estado' in data:
        solicitud.estado = data['estado']
    if 'fecha_respuesta' in data:
        solicitud.fecha_respuesta = data['fecha_respuesta']

    db.session.commit()
    return jsonify(solicitud.serialize()), 200

@api.route('/solicitudes/<int:id>', methods=['DELETE'])
def delete_solicitud(id):
    solicitud = Solicitud.query.get(id)
    if not solicitud:
        return jsonify({"error": "Solicitud no encontrada"}), 404

    db.session.delete(solicitud)
    db.session.commit()
    return jsonify({"message": "Solicitud eliminada correctamente"}), 200

# Rutas específicas para los coaches 
@api.route('/coach/mensaje', methods=['POST'])
def coach_enviar_mensaje():
    body = request.get_json()
    
    id_coach = body.get('id_coach')  # El ID del coach es obligatorio en esta rama
    id_usuario = body.get('id_usuario')
    contenido = body.get('contenido')

    if not contenido or not id_usuario or not id_coach:
        return jsonify({"msg": "Faltan datos: id_usuario, id_coach y contenido son obligatorios"}), 400

    nuevo_mensaje = Mensajes(
        id_coach=id_coach,
        id_usuario=id_usuario,
        contenido=contenido,
        fecha_envio=datetime.utcnow(),
        visto=False
    )
    db.session.add(nuevo_mensaje)
    db.session.commit()

    return jsonify({"msg": "Mensaje enviado correctamente", "mensaje": nuevo_mensaje.serialize()}), 201

# Obtener mensajes enviados por un coach
@api.route('/coach/mensajes/<int:id_coach>', methods=['GET'])
def obtener_mensajes_coach(id_coach):
    mensajes = Mensajes.query.filter_by(id_coach=id_coach).all()
    if not mensajes:
        return jsonify({"msg": "No se encontraron mensajes para este coach"}), 404

    mensajes_serializados = [mensaje.serialize() for mensaje in mensajes]
    return jsonify(mensajes_serializados), 200

# Marcar un mensaje como visto (si es del coach)
@api.route('/coach/mensaje/<int:id_mensaje>', methods=['PUT'])
def coach_marcar_mensaje_visto(id_mensaje):
    mensaje = Mensajes.query.filter_by(id=id_mensaje, id_coach=request.json.get('id_coach')).first()

    if not mensaje:
        return jsonify({"msg": "Mensaje no encontrado o no pertenece al coach"}), 404

    mensaje.visto = True
    db.session.commit()

    return jsonify({"msg": "Mensaje marcado como visto por el coach", "mensaje": mensaje.serialize()}), 200

# Eliminar un mensaje (enviado por el coach)
@api.route('/coach/mensaje/<int:id_mensaje>', methods=['DELETE'])
def coach_eliminar_mensaje(id_mensaje):
    mensaje = Mensajes.query.filter_by(id=id_mensaje, id_coach=request.json.get('id_coach')).first()

    if not mensaje:
        return jsonify({"msg": "Mensaje no encontrado o no pertenece al coach"}), 404

    # Eliminar el mensaje
    db.session.delete(mensaje)
    db.session.commit()

    return jsonify({"msg": "Mensaje eliminado correctamente por el coach"}), 200

# Endpoint para subir imágenes
@coaches_bp.route('/coaches/upload_image', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Sube la imagen a Cloudinary
        response = cloudinary.uploader.upload(file)
        image_url = response['secure_url']  # URL de la imagen subida

        # Aquí podrías guardar la URL en la base de datos si es necesario
        # Ejemplo: save_image_url_to_db(coach_id, image_url)

        return jsonify({'message': 'Image uploaded successfully', 'url': image_url}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint para obtener la imagen de un coach
@coaches_bp.route('/coaches/image/<int:coach_id>', methods=['GET'])
def get_image(coach_id):
    # Aquí deberías buscar la URL de la imagen en tu base de datos usando coach_id
    # Ejemplo: image_url = get_image_url_from_db(coach_id)
    
    image_url = 'url_de_imagen_ejemplo'  # Reemplaza esto con tu lógica de obtención de imagen
    
    if image_url:
        return jsonify({'image_url': image_url}), 200
    else:
        return jsonify({'error': 'Image not found'}), 404

# Endpoint para actualizar la imagen de un coach
@coaches_bp.route('/coaches/update_image/<int:coach_id>', methods=['PUT'])
def update_image(coach_id):
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Sube la nueva imagen a Cloudinary
        response = cloudinary.uploader.upload(file)
        image_url = response['secure_url']  # URL de la nueva imagen

        # Aquí deberías actualizar la URL en tu base de datos usando coach_id
        # Ejemplo: update_image_url_in_db(coach_id, image_url)

        return jsonify({'message': 'Image updated successfully', 'url': image_url}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint para eliminar la imagen de un coach
@coaches_bp.route('/coaches/delete_image/<int:coach_id>', methods=['DELETE'])
def delete_image(coach_id):
    try:
        # Aquí deberías eliminar la URL de la imagen de tu base de datos usando coach_id
        # Ejemplo: delete_image_url_from_db(coach_id)

        # Si es necesario, también puedes eliminar la imagen de Cloudinary usando el public_id
        # cloudinary.uploader.destroy(public_id)

        return jsonify({'message': 'Image deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
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

# Ruta protegida
@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Obtenemos la identidad del usuario actual usando el token JWT
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()  # Crea las tablas de la base de datos
    app.run(debug=True)