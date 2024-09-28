"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, SmokerUser, TiposConsumo
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime

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
    
    # Verifica que se reciban todos los campos obligatorios
    required_fields = ['email_usuario', 'password_email', 'nombre_usuario', 'genero_usuario', 
                       'nacimiento_usuario', 'numerocigarro_usuario', 'periodicidad', 
                       'tiempo_fumando', 'id_tipo']
    if not data or not all(key in data for key in required_fields):
        return jsonify({"error": "Datos incompletos"}), 400

    # Crea un nuevo objeto SmokerUser y lo guarda en la base de datos
    new_smoker = SmokerUser(
        email_usuario=data['email_usuario'],
        password_email=data['password_email'],
        nombre_usuario=data['nombre_usuario'],
        genero_usuario=data['genero_usuario'],
        nacimiento_usuario=datetime.strptime(data['nacimiento_usuario'], '%Y-%m-%d').date(),
        numerocigarro_usuario=data['numerocigarro_usuario'],
        periodicidad=data['periodicidad'],
        tiempo_fumando=data['tiempo_fumando'],
        id_tipo=data['id_tipo'],
        foto_usuario=data.get('foto_usuario')  # Opcional
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

if __name__ == '__main__':
    app.run(debug=True)


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

@api.route('/api/tiposconsumo', methods=['POST'])
def add_consuming():
    data = request.get_json()

    required_fields = ['name'] 
    if not data or not all(key in data for key in required_fields):
        return jsonify({"error": "Datos incompletos"}), 400

    new_type = TiposConsumo(name=data['name']) 

    db.session.add(new_type)
    db.session.commit()
    
    return jsonify(new_type.serialize()), 201

