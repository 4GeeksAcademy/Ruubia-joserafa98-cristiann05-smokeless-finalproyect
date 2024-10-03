import React, { useState, useEffect } from "react";
import { useStore } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/CreateProfileUser.css"; // Importar el CSS específico

const CreateProfileUser = () => {
    const { store, actions } = useStore();
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [genero, setGenero] = useState("masculino");
    const [cumpleaños, setCumpleaños] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (store.loggedInUser) {
            setNombreUsuario(store.loggedInUser.nombre || "");
            setGenero(store.loggedInUser.genero || "masculino");
            if (store.loggedInUser.cumpleaños && typeof store.loggedInUser.cumpleaños === 'string') {
                setCumpleaños(store.loggedInUser.cumpleaños.split("T")[0]);
            }
        }
    }, [store.loggedInUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!store.loggedInUser) {
            setError("No hay usuario logueado. Por favor, inicia sesión.");
            return;
        }

        const updatedData = {
            nombre_usuario: nombreUsuario,
            genero_usuario: genero,
            nacimiento_usuario: cumpleaños,
        };

        const success = await actions.updateProfile(store.loggedInUser.id, updatedData);
        if (success) {
            alert("Perfil actualizado con éxito");
            navigate('/question-config-smoker');
        } else {
            alert("Error al actualizar el perfil");
        }
    };

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

export default CreateProfileUser;
