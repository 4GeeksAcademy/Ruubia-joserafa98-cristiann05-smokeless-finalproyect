import cloudinary
import cloudinary.uploader

# Configuración de Cloudinary
cloudinary.config(
    cloud_name="tu_cloud_name",
    api_key="tu_api_key",
    api_secret="tu_api_secret"
)

def upload_image_to_coach(file_path):
    return upload_image(file_path, 'coaches')

def upload_image_to_smoker(file_path):
    return upload_image(file_path, 'smoker')

def upload_image(file_path, folder):
    try:
        resultado = cloudinary.uploader.upload(
            file_path,
            folder=folder,
            overwrite=False,  
            unique_filename=True
        )
        return resultado['secure_url']
    except Exception as e:
        print(f"Error al subir la imagen: {e}")
        return None
