import React, { useState, useEffect } from "react";
import { useStore } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/CreateProfileUser.css"; // Importar el CSS específico

const CreateConsumProfile = () => {
    const { store, actions } = useStore();
    const [formaConsumo, setFormaConsumo] = useState("cigarros"); // Valor por defecto
    const [numeroCigarrillos, setNumeroCigarrillos] = useState(""); // Valor por defecto
    const [periodicidadConsumo, setPeriodicidadConsumo] = useState("diaria"); // Valor por defecto
    const [tiempoFumando, setTiempoFumando] = useState(""); // Valor por defecto
    const [error, setError] = useState(""); // Estado para manejar errores
    const navigate = useNavigate(); // Hook para la navegación

    // Cargar información del usuario logueado al montar el componente
    useEffect(() => {
        if (store.loggedInUser) {
            console.log("Usuario logueado en CreateConsumProfile:", store.loggedInUser); // Log de usuario logueado
            setFormaConsumo(store.loggedInUser.forma_consumo || "cigarros");
            setNumeroCigarrillos(store.loggedInUser.numero_cigarrillos || "");
            setPeriodicidadConsumo(store.loggedInUser.periodicidad_consumo || "diaria");
            setTiempoFumando(store.loggedInUser.tiempo_fumando || "");
        }
    }, [store.loggedInUser]);

    // Cargar tipos de consumo desde el store al montar el componente
    useEffect(() => {
        actions.getTiposConsumo(); // Cargar tipos de consumo desde el store
    }, [actions]);

    // Manejo del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        setError(""); // Reinicia el estado de error

        if (!store.loggedInUser) {
            setError("No hay usuario logueado. Por favor, inicia sesión.");
            return; // Sale de la función si no hay usuario logueado
        }

        // Datos a actualizar
        const updatedData = {
            forma_consumo: formaConsumo,
            numero_cigarrillos: numeroCigarrillos !== "" ? parseInt(numeroCigarrillos) : null, // Asegúrate de que sea un número o null
            periodicidad_consumo: periodicidadConsumo,
            tiempo_fumando: tiempoFumando,
        };

        console.log("Datos enviados en el consumo:", updatedData); // Log de datos enviados

        // Intenta actualizar el perfil de consumo
        const success = await actions.updateConsumptionProfile(store.loggedInUser.id, updatedData);
        if (success) {
            alert("Información de consumo actualizada con éxito");
            navigate('/dashboard-smoker'); // Redirige al formulario de perfil
        } else {
            alert("Error al actualizar la información de consumo");
        }
    };

    // Muestra un mensaje si no hay usuario logueado
    if (!store.loggedInUser) {
        return <div>No hay usuario logueado. Por favor, inicia sesión.</div>;
    }

    // Obtiene los tipos de consumo desde el store
    const tiposConsumo = store.tiposConsumo || []; // Asegúrate de que se esté almacenando en el store

    // Renderiza el formulario
    return (
        <div className="consumption-form">
            <h2 className="form-title">Actualizar Información de Consumo</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Forma de Consumo:</label>
                    <select
                        value={formaConsumo}
                        onChange={(e) => setFormaConsumo(e.target.value)}
                    >
                        {tiposConsumo.map(tipo => (
                            <option key={tipo.id} value={tipo.name}>{tipo.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Número de Cigarrillos:</label>
                    <input
                        type="number"
                        value={numeroCigarrillos || ""}
                        onChange={(e) => setNumeroCigarrillos(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Periodicidad de Consumo:</label>
                    <select
                        value={periodicidadConsumo}
                        onChange={(e) => setPeriodicidadConsumo(e.target.value)}
                    >
                        <option value="diaria">Diaria</option>
                        <option value="semanal">Semanal</option>
                        <option value="mensual">Mensual</option>
                        <option value="anual">Anual</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Tiempo Fumando:</label>
                    <input
                        type="text"
                        value={tiempoFumando || ""}
                        onChange={(e) => setTiempoFumando(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>} {/* Muestra mensaje de error si existe */}
                <button type="submit" className="submit-button">Actualizar Información de Consumo</button>
            </form>
        </div>
    );
};

export default CreateConsumProfile;
