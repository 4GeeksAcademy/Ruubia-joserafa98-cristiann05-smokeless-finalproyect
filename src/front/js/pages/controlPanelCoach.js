import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import SolicitudesCoach from "../component/SolicitudesCoach";

const ControlPanelCoach = () => {
    const { store, actions } = useContext(Context); // Acceder al estado global y a las acciones
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si el coach está autenticado
        if (!store.isAuthenticated) {
            // Redirigir al coach a la página de login si no está autenticado
            navigate("/login-coach"); // Cambia esto a la ruta de tu página de login
        }
    }, [store.isAuthenticated, navigate]); // Dependencias de useEffect

    const handleLogout = () => {
        // Llama a la acción de logout
        actions.logoutCoach(); // Ejecuta la acción de logout

        // Redirigir a la página de login
        navigate("/login-coach");
    };

    return (
        <div className="container mt-5">
            <h1>Welcome to your Dashboard!</h1>
            <p>This is the control panel for coaches.</p>
            <p>Here you will be able to manage your profile, track your clients' progress, and much more.</p>
            <button className="btn btn-primary">Manage Profile</button>
            <button className="btn btn-secondary ml-3">Track Clients</button>
            <button className="btn btn-info mt-3" onClick={() => navigate("/control-panel-coach/map")}>
                View Coach Map
            </button>
            <button className="btn btn-info mt-3" onClick={() => navigate("/coach-profile")}>
                View Coach Profile
            </button>
            <button className="btn btn-danger mt-3" onClick={handleLogout}>
                Logout
            </button> {/* Botón para cerrar sesión */}
            <SolicitudesCoach />
        </div>
    );
};

export default ControlPanelCoach;
