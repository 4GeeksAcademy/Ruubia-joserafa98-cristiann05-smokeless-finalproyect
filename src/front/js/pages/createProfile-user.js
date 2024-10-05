import React, { useState, useEffect } from "react";
import { useStore } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/CreateProfileUser.css"; // Importar el CSS específico

const CreateProfileUser = () => {
    const { store, actions } = useStore(); // Acceso al store y acciones
    const [nombre_usuario, setnombre_usuario] = useState("");
    const [genero, setGenero] = useState("masculino");
    const [cumpleaños, setCumpleaños] = useState("");
    const [foto_usuario, setfoto_usuario] = useState(null); // Estado para la imagen
    const [error, setError] = useState(""); // Manejo de errores
    const navigate = useNavigate(); // Hook de navegación

    // Efecto para cargar los datos del usuario logueado
    useEffect(() => {
        if (store.loggedInUser) {
            setnombre_usuario(store.loggedInUser.nombre || ""); // Cargar nombre
            setGenero(store.loggedInUser.genero || "masculino"); // Cargar género
            if (store.loggedInUser.cumpleaños && typeof store.loggedInUser.cumpleaños === 'string') {
                setCumpleaños(store.loggedInUser.cumpleaños.split("T")[0]); // Cargar cumpleaños
            }
            setfoto_usuario(store.loggedInUser.foto_usuario || null); // Cargar la imagen si existe
        }
    }, [store.loggedInUser]); // Efecto depende de los cambios en `loggedInUser`

    // Manejar la selección de la imagen
    const handleImageUpload = (e) => {
        setfoto_usuario(e.target.files[0]); // Guardar la imagen seleccionada
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Limpiar errores previos

        // Validación de que el usuario esté logueado
        if (!store.loggedInUser) {
            setError("No hay usuario logueado. Por favor, inicia sesión.");
            return;
        }

        // Subir la imagen a Cloudinary si se seleccionó una
        let imageUrl = store.loggedInUser.foto_usuario; // Si ya tiene una imagen, se conserva
        if (foto_usuario) {
            const uploadResult = await actions.uploadSmokerImage(foto_usuario); // Subir imagen
            if (uploadResult) {
                imageUrl = uploadResult.secure_url; // Guardar URL de la imagen subida
            } else {
                setError("Error al subir la imagen. Inténtalo de nuevo.");
                return;
            }
        }

        // Datos a enviar al actualizar perfil
        const updatedData = {
            nombre_usuario: nombre_usuario,
            genero_usuario: genero,
            nacimiento_usuario: cumpleaños,
            foto_usuario: imageUrl, // Guardar la URL de la imagen en la base de datos
        };

        console.log("Datos enviados en el perfil:", updatedData);

        // Llamada a la acción para actualizar el perfil
        const success = await actions.updateProfile(store.loggedInUser.id, updatedData);
        if (success) {
            alert("Perfil actualizado con éxito");
            navigate('/question-config-smoker'); // Navegar a la siguiente pantalla
        } else {
            alert("Error al actualizar el perfil");
        }
    };

    // Si no hay usuario logueado, muestra un mensaje
    if (!store.loggedInUser) {
        return <div>No hay usuario logueado. Por favor, inicia sesión.</div>;
    }

    return (
        <div className="profile-form">
            <h2 className="form-title">Actualizar Perfil</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre de Usuario:</label>
                    <input
                        type="text"
                        value={nombre_usuario}
                        onChange={(e) => setnombre_usuario(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Género:</label>
                    <select
                        value={genero}
                        onChange={(e) => setGenero(e.target.value)}
                        required
                    >
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Cumpleaños:</label>
                    <input
                        type="date"
                        value={cumpleaños}
                        onChange={(e) => setCumpleaños(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Foto de Perfil:</label>
                    <input
                        type="file"
                        onChange={handleImageUpload}
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-button">Actualizar Perfil</button>
            </form>
        </div>
    );
};

export default CreateProfileUser;

