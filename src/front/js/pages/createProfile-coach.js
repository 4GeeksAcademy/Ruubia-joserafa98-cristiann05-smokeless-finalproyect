import React, { useState, useEffect } from "react";
import { useStore } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const CreateProfileCoach = () => {
    const { store, actions } = useStore();
    const [nombreCoach, setNombreCoach] = useState("");
    const [genero, setGenero] = useState("masculino");
    const [cumpleaños, setCumpleaños] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (store.loggedInCoach) {
            console.log("Coach logueado en CreateProfileCoach:", store.loggedInCoach);
            setNombreCoach(store.loggedInCoach.nombre || "");
            setGenero(store.loggedInCoach.genero || "masculino");
            // Asegúrate de que el cumpleaños esté en el formato correcto
            if (store.loggedInCoach.cumpleaños) {
                setCumpleaños(new Date(store.loggedInCoach.cumpleaños).toISOString().split("T")[0]);
            }
        }
    }, [store.loggedInCoach]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!store.loggedInCoach) {
            setError("No hay coach logueado. Por favor, inicia sesión.");
            return;
        }

        // Validar que el cumpleaños no esté vacío
        if (!cumpleaños) {
            setError("La fecha de cumpleaños es requerida.");
            return;
        }

        const updatedData = {
            nombre_coach: nombreCoach,
            genero_coach: genero,
            cumpleaños_coach: cumpleaños, // Aquí se asegura que el campo esté bien definido
        };

        console.log("Datos enviados en el perfil:", updatedData);

        const success = await actions.updateProfile(store.loggedInCoach.id, updatedData);
        if (success) {
            alert("Perfil actualizado con éxito");
            navigate('/control-panel-coach'); // Redirige a la página deseada
        } else {
            alert("Error al actualizar el perfil");
        }
    };

    if (!store.loggedInCoach) {
        return <div>No hay coach logueado. Por favor, inicia sesión.</div>;
    }

    return (
        <div className="profile-form">
            <h2>Actualizar Perfil de Coach</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre de Coach:</label>
                    <input
                        type="text"
                        value={nombreCoach}
                        onChange={(e) => setNombreCoach(e.target.value)}
                        required
                    />
                </div>
                <div>
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
                <div>
                    <label>Cumpleaños:</label>
                    <input
                        type="date"
                        value={cumpleaños}
                        onChange={(e) => setCumpleaños(e.target.value)}
                        required
                    />
                </div>
                {error && <p>{error}</p>}
                <button type="submit">Actualizar Perfil</button>
            </form>
        </div>
    );
};

export default CreateProfileCoach;
