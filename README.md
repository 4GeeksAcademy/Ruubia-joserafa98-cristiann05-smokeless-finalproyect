# Smokeless - Proyecto Final

Smokeless es una plataforma web diseñada para ayudar a los fumadores a dejar de fumar mediante el seguimiento y la interacción con entrenadores especializados. El sistema permite a los usuarios fumadores y a los entrenadores trabajar juntos a través de un panel de control personalizado, herramientas de seguimiento y más.

## Tabla de Contenidos
- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Uso](#uso)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

## Características
- **Registro y autenticación de usuarios**: Tanto los entrenadores como los fumadores pueden registrarse y acceder a sus respectivos paneles de control.
- **Panel de Control**: Cada tipo de usuario tiene acceso a un panel personalizado para gestionar su progreso o monitorear a los fumadores.
- **Seguimiento de consumo**: Los fumadores pueden registrar su progreso, y los entrenadores pueden observar este seguimiento para proporcionar retroalimentación.
- **Componentes reutilizables**: Diseño modular y reutilizable para los diferentes elementos de la interfaz.


## Estructura del Proyecto

```
src/                             # Directorio principal
├── api                         # Lógica del backend y rutas de la API
│   ├── init.py                # Inicialización del módulo
│   ├── admin.py               # Administración del sistema
│   ├── commands.py            # Comandos de gestión
│   ├── models.py              # Definición de modelos de la base de datos
│   ├── routes.py              # Rutas de la API
│   └── utils.py               # Funciones auxiliares
├── app.py                     # Punto de entrada de la aplicación
├── front                      # Código del frontend
│   ├── img                    # Imágenes y logos
│   ├── js                     # Scripts y componentes de frontend
│   └── styles                 # Archivos de estilo CSS
└── wsgi.py                    # Configuración WSGI para el despliegue
``` 
├── api                  # Lógica del backend y rutas de la API
│   ├── init.py         # Inicialización del módulo
│   ├── admin.py        # Administración del sistema
│   ├── commands.py     # Comandos de gestión
│   ├── models.py       # Definición de modelos de la base de datos
│   ├── routes.py       # Rutas de la API
│   └── utils.py        # Funciones auxiliares
├── app.py              # Punto de entrada de la aplicación
├── front               # Código del frontend
│   ├── img             # Imágenes y logos
│   ├── js              # Scripts y componentes de frontend
│   └── styles          # Archivos de estilo CSS
└── wsgi.py             # Configuración WSGI para el despliegue

## Instalación

Sigue los pasos a continuación para ejecutar el proyecto localmente:

1. Clona este repositorio:

    ```bash
    git clone https://github.com/4GeeksAcademy/Ruubia-joserafa98-cristiann05-smokeless-finalproyect.git
    ```

2. Instala las dependencias necesarias del backend (asegúrate de tener [Pipenv](https://pipenv.pypa.io/en/latest/) instalado):

    ```bash
    pipenv install
    ```

3. Instala las dependencias del frontend:

    ```bash
    npm install
    ```

## Uso

1. **Iniciar el backend**:
   
   Para iniciar el servidor backend con la base de datos:

   ```bash
   pipenv run start
   ```

2. **Iniciar el frontend**:

   Para iniciar el servidor del frontend:

   ```bash
   npm run start
   ```

Abre tu navegador en http://localhost:3000 para ver la aplicación frontend, y el backend correrá en http://localhost:5000.

## Tecnologías Utilizadas
- **Backend**: Python (Flask)
- **Frontend**: HTML, CSS, JavaScript (React)
- **Base de datos**: SQLAlchemy (SQLite/PostgreSQL)
- **Despliegue**: WSGI

## Contribuciones
¡Las contribuciones son bienvenidas! Si deseas colaborar, por favor abre un issue o realiza un pull request.

## Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

