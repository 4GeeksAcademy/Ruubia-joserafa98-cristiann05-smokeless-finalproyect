from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, SmokerUser, Coach, TiposConsumo, Mensajes, Solicitud
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime
from cloudinary_config import cloudinary
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
        forma_consumo=None,
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

@api.route('/create_config_profile/<int:user_id>', methods=['PUT'])
def update_consumo_profile(user_id):
    user = SmokerUser.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    forma_consumo_str = request.json.get('forma_consumo', None)
    numero_cigarrillos = request.json.get('numero_cigarrillos', None)
    periodicidad_consumo = request.json.get('periodicidad_consumo', None)
    tiempo_fumando = request.json.get('tiempo_fumando', None)

    if forma_consumo_str:
        tipo_consumo = TiposConsumo.query.filter_by(name=forma_consumo_str).first()
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
    cumpleaños = request.json.get('cumpleaños_coach')  # Asegúrate de que este nombre coincida

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

@api.route('/login-coach', methods=['POST'])
def login_coach():
    email = request.json.get('email_coach', None)
    password = request.json.get('password_coach', None)

    if not email or not password:
        return jsonify({"msg": "Faltan email o password"}), 400

    coach = Coach.query.filter_by(email_coach=email).first()
    if not coach or coach.password_coach != password:
        return jsonify({"msg": "Credenciales inválidas"}), 401
    
    # Generar un token
    token = create_access_token(identity=coach.id)

    return jsonify({
        "msg": "Login exitoso",
        "coach_id": coach.id,
        "email_coach": coach.email_coach,
        "token": token  # Se eliminó nombre_coach
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

# Endpoint para subir imágenes
@coaches_bp.route('/coaches/upload_image/<int:coach_id>', methods=['POST'])
def upload_image(coach_id):
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Sube la imagen a Cloudinary
        response = cloudinary.uploader.upload(file)
        image_url = response['secure_url']

        # Guarda la URL en la base de datos
        coach = Coach.query.get(coach_id)
        if coach:
            coach.foto_coach = image_url
            db.session.commit()

        return jsonify({'message': 'Image uploaded successfully', 'url': image_url}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint para obtener la imagen de un coach
@coaches_bp.route('/coaches/image/<int:coach_id>', methods=['GET'])
def get_image(coach_id):
    coach = Coach.query.get(coach_id)
    if coach and coach.foto_coach:
        return jsonify({'image_url': coach.foto_coach}), 200
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
        coach = Coach.query.get(coach_id)
        if not coach:
            return jsonify({'error': 'Coach not found'}), 404

        response = cloudinary.uploader.upload(file)
        image_url = response['secure_url']
        new_public_id = response['public_id']

        if coach.public_id:
            cloudinary.uploader.destroy(coach.public_id)

        coach.foto_coach = image_url
        coach.public_id = new_public_id
        db.session.commit()

        return jsonify({'message': 'Image updated successfully', 'url': image_url}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint para eliminar la imagen de un coach
@coaches_bp.route('/coaches/delete_image/<int:coach_id>', methods=['DELETE'])
def delete_image(coach_id):
    try:
        coach = Coach.query.get(coach_id)
        if coach:
            if coach.public_id:
                cloudinary.uploader.destroy(coach.public_id)

            coach.foto_coach = None
            coach.public_id = None
            db.session.commit()

            return jsonify({'message': 'Image deleted successfully'}), 200
        else:
            return jsonify({'error': 'Coach not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Repetir lógica similar para los smokers...

# Endpoint para subir imágenes de un smoker
@api.route('/smokers/upload_image/<int:smoker_id>', methods=['POST'])
def upload_smoker_image(smoker_id):
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Sube la imagen a Cloudinary
        response = cloudinary.uploader.upload(file)
        image_url = response['secure_url']

        # Actualiza el campo foto_usuario en la base de datos
        smoker = SmokerUser.query.get(smoker_id)
        if smoker:
            smoker.foto_usuario = image_url
            db.session.commit()
            return jsonify({'message': 'Image uploaded successfully', 'url': image_url}), 200
        else:
            return jsonify({'error': 'Smoker not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint para obtener la imagen de un smoker
@api.route('/smokers/image/<int:smoker_id>', methods=['GET'])
def get_smoker_image(smoker_id):
    smoker = SmokerUser.query.get(smoker_id)
    if smoker and smoker.foto_usuario:
        return jsonify({'image_url': smoker.foto_usuario}), 200
    else:
        return jsonify({'error': 'Image not found'}), 404

# Endpoint para actualizar la imagen de un smoker
@api.route('/smokers/update_image/<int:smoker_id>', methods=['PUT'])
def update_smoker_image(smoker_id):
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Busca el smoker en la base de datos
        smoker = SmokerUser.query.get(smoker_id)
        if not smoker:
            return jsonify({'error': 'Smoker not found'}), 404

        # Sube la nueva imagen a Cloudinary
        response = cloudinary.uploader.upload(file)
        image_url = response['secure_url']
        new_public_id = response['public_id']

        # Si hay una imagen anterior, se puede eliminar
        if smoker.public_id:
            # Elimina la imagen anterior de Cloudinary
            cloudinary.uploader.destroy(smoker.public_id)

        # Actualiza la URL y el public_id en la base de datos
        smoker.foto_usuario = image_url
        smoker.public_id = new_public_id
        db.session.commit()

        return jsonify({'message': 'Image updated successfully', 'url': image_url}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint para eliminar la imagen de un smoker
@api.route('/smokers/delete_image/<int:smoker_id>', methods=['DELETE'])
def delete_smoker_image(smoker_id):
    try:
        smoker = SmokerUser.query.get(smoker_id)
        if smoker:
            if smoker.public_id:
                # Elimina la imagen de Cloudinary
                cloudinary.uploader.destroy(smoker.public_id)

            smoker.foto_usuario = None  # Borra la URL de la imagen
            smoker.public_id = None  # Borra el public_id
            db.session.commit()

            return jsonify({'message': 'Image deleted successfully'}), 200
        else:
            return jsonify({'error': 'Smoker not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Obtener las ubicaciones de todos los coaches (GET)
@api.route('/coaches/locations', methods=['GET'])
def get_coaches_locations():
    coaches = Coach.query.all()
    coaches_data = [
        {
            "id": coach.id,
            "nombre": coach.nombre_coach,
            "latitud": coach.latitud,
            "longitud": coach.longitud,
            "direccion": coach.direccion
        }
        for coach in coaches if coach.latitud and coach.longitud
    ]
    return jsonify(coaches_data), 200

# Agregar o actualizar la ubicación de un coach (POST)
@api.route('/coaches/locations', methods=['POST'])
def add_or_update_coach_location():
    data = request.json
    coach_id = data.get('coach_id')
    latitud = data.get('latitud')
    longitud = data.get('longitud')
    direccion = data.get('direccion')

    coach = Coach.query.get(coach_id)
    if not coach:
        return jsonify({"msg": "Coach no encontrado"}), 404

    # Actualiza los campos del coach
    coach.latitud = latitud
    coach.longitud = longitud
    coach.direccion = direccion

    db.session.commit()
    return jsonify({"msg": "Ubicación del coach actualizada", "coach_id": coach.id}), 201

# Actualizar la ubicación de un coach (PUT)
@api.route('/coaches/locations/<int:coach_id>', methods=['PUT'])
def update_coach_location(coach_id):
    coach = Coach.query.get(coach_id)
    if not coach:
        return jsonify({"msg": "Coach no encontrado"}), 404

    data = request.json
    coach.latitud = data.get('latitud', coach.latitud)
    coach.longitud = data.get('longitud', coach.longitud)
    coach.direccion = data.get('direccion', coach.direccion)

    db.session.commit()
    return jsonify({"msg": "Ubicación del coach actualizada", "coach_id": coach.id}), 200

# Eliminar la ubicación de un coach (DELETE)
@api.route('/coaches/locations/<int:coach_id>', methods=['DELETE'])
def delete_coach_location(coach_id):
    coach = Coach.query.get(coach_id)
    if not coach:
        return jsonify({"msg": "Coach no encontrado"}), 404

    coach.latitud = None
    coach.longitud = None
    coach.direccion = None
    db.session.commit()

    return jsonify({"msg": "Ubicación del coach eliminada", "coach_id": coach.id}), 204

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
    
    if 'estado' in data:
        solicitud.estado = data['estado'] in ['true', 'True', '1']  # Convertir a booleano
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
    
@api.route('/coach_info/<int:coach_id>', methods=['GET'])
def get_coach_info(coach_id):
    try:
        coach = Coach.query.get(coach_id)  # Obtiene el coach por ID
        if not coach:
            return jsonify({"error": "Coach no encontrado"}), 404  # Maneja el caso de no encontrado

        return jsonify(coach.serialize()), 200  # Retorna la información del coach
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Maneja cualquier excepción
    
if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()  # Crea las tablas de la base de datos
    app.run(debug=True)
