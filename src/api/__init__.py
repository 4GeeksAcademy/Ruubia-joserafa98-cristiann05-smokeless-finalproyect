# src/api/__init__.py

from flask import Blueprint
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()  # Inicializa el objeto db
api = Blueprint('api', __name__)  # Crea un Blueprint para la API

# Puedes dejar este archivo vacío o agregar funciones auxiliares en el futuro
