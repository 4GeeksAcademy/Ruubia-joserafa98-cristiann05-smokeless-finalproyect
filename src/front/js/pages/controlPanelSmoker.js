import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import CoachCard from "../component/CoachCards";

const ControlPanelSmoker = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("token");
            console.log("Token actual:", token); // Log para verificar el token
            if (!token) {
                navigate('/'); // Redirige a la página principal si no hay token
            } else {
                setLoading(false);
            }
        };

        checkToken();
    }, [navigate]);

    const handleLogout = () => {
        actions.logoutsmoker(); // Llama a la acción de cierre de sesión
        setTimeout(() => {
            navigate('/'); // Redirige a la página principal después de un breve retraso
        }, 100); // Puedes ajustar el tiempo según sea necesario
    };

    if (loading) {
        return <div>Loading...</div>; // Mensaje mientras se verifica el token
    }

    return (
        <div className="container mt-5">
            <h1>Welcome to your Dashboard!</h1>
            <p>This is the control panel for smokers.</p>
            <button 
                className="btn btn-primary mt-3" 
                onClick={() => navigate("/smoker-profile")}
            >
                Ver Perfil del Fumador
            </button>
            <button className="btn btn-info mt-3" onClick={() => navigate("/control-panel-smoker/map")}>
                mapa</button>
            <button className="btn btn-danger" onClick={handleLogout}>
                Logout
            </button>
            <CoachCard />
        </div>
    );
};

export default ControlPanelSmoker;
