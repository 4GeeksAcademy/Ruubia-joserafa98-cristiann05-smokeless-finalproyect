import React, { useState, useEffect } from "react";
import { useStore } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/CreateProfileUser.css"; // Importar el CSS específico

const CreateConsumProfile = () => {
    const { store, actions } = useStore();
    const [formaConsumo, setFormaConsumo] = useState("cigarros");
    const [numeroCigarrillos, setNumeroCigarrillos] = useState("");
    const [periodicidadConsumo, setPeriodicidadConsumo] = useState("diaria");
    const [tiempoFumando, setTiempoFumando] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (store.loggedInUser) {
            setFormaConsumo(store.loggedInUser.forma_consumo || "cigarros");
            setNumeroCigarrillos(store.loggedInUser.numero_cigarrillos || "");
            setPeriodicidadConsumo(store.loggedInUser.periodicidad_consumo || "diaria");
            setTiempoFumando(store.loggedInUser.tiempo_fumando || "");
        }
    }, [store.loggedInUser]);    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!store.loggedInUser) {
            setError("No hay usuario logueado. Por favor, inicia sesión.");
            return;
        }

        // Asegúrate de enviar los datos correctos
        const updatedData = {
            forma_consumo: formaConsumo,
            numero_cigarrillos: numeroCigarrillos !== "" ? parseInt(numeroCigarrillos) : null, // Asegúrate de que sea un número o null
            periodicidad_consumo: periodicidadConsumo,
            tiempo_fumando: tiempoFumando,
        };

        const success = await actions.updateConsumptionProfile(store.loggedInUser.id, updatedData);
        if (success) {
            alert("Información de consumo actualizada con éxito");
            navigate('/control-panel-smoker'); // Redirige al formulario de perfil
        } else {
            alert("Error al actualizar la información de consumo");
        }
    };

    if (!store.loggedInUser) {
        return <div>No hay usuario logueado. Por favor, inicia sesión.</div>;
    }

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
                        <option value="cigarros">Cigarros</option>
                        <option value="vaper">Vaper</option>
                        <option value="puros">Puros</option>
                        <option value="pipas">Pipas</option>
                        <option value="tabaco de liar">Tabaco de liar</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Número de Cigarrillos:</label>
                    <input
                        type="number"
                        value={numeroCigarrillos || ""}
                        onChange={(e) => setNumeroCigarrillos(e.target.value)}
                        // Eliminé el `required`, así se permite que sea opcional
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
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-button">Actualizar Información de Consumo</button>
            </form>
        </div>
    );
};

export default CreateConsumProfile;
