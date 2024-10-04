import React, { useState, useEffect } from "react";
import { useStore } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/CreateProfileCoach.css"; // Importar el CSS específico

const CreateProfileCoach = () => {
    const { store, actions } = useStore(); // Acceso al store y acciones
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [genero, setGenero] = useState("masculino");
    const [cumpleaños, setCumpleaños] = useState("");
    const [error, setError] = useState(""); // Manejo de errores
    const navigate = useNavigate(); // Hook de navegación

    // Efecto para cargar los datos del coach logueado
    useEffect(() => {
        const fetchCoachInfo = async () => {
            if (store.loggedInUser) {
                const coachId = store.loggedInUser.id; // Asumiendo que el id del coach está en loggedInUser
                const coachInfo = await actions.getCoachInfo(coachId);
                if (coachInfo) {
                    setNombreUsuario(coachInfo.nombre || ""); // Cargar nombre
                    setGenero(coachInfo.genero || "masculino"); // Cargar género
                    if (coachInfo.cumpleaños && typeof coachInfo.cumpleaños === 'string') {
                        setCumpleaños(coachInfo.cumpleaños.split("T")[0]); // Cargar cumpleaños
                    }
                } else {
                    setError("No se pudo cargar la información del coach.");
                }
            }
        };

        fetchCoachInfo(); // Llamar a la función para obtener la información del coach
    }, [store.loggedInUser, actions]); // Efecto depende de los cambios en `loggedInUser` y `actions`

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Limpiar errores previos

        // Validación de que el usuario esté logueado
        if (!store.loggedInUser) {
            setError("No hay usuario logueado. Por favor, inicia sesión.");
            return;
        }

        // Datos a enviar al actualizar perfil
        const updatedData = {
            nombre_usuario: nombreUsuario,
            genero_usuario: genero,
            nacimiento_usuario: cumpleaños,
        };

        console.log("Datos enviados en el perfil del coach:", updatedData);

        // Llamada a la acción para actualizar el perfil
        const success = await actions.updateProfileCoach(store.loggedInUser.id, updatedData);
        if (success) {
            alert("Perfil de coach actualizado con éxito");
            navigate('/control-panel-coach'); // Navegar a la siguiente pantalla
        } else {
            alert("Error al actualizar el perfil del coach");
        }
    };

    // Si no hay usuario logueado, muestra un mensaje
    if (!store.loggedInUser) {
        return <div>No hay usuario logueado. Por favor, inicia sesión.</div>;
    }

    return (
        <div className="profile-form">
            <h2 className="form-title">Actualizar Perfil del Coach</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre de Usuario:</label>
                    <input
                        type="text"
                        value={nombreUsuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
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
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-button">Actualizar Perfil</button>
            </form>
        </div>
    );
};

export default CreateProfileCoach;
