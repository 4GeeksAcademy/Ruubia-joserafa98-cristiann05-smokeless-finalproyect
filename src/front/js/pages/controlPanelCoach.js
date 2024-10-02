import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import SolicitudesCoach from "../component/SolicitudesCoach";

const ControlPanelCoach = () => {
    const { store } = useContext(Context); // Acceder al estado global
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si el coach está autenticado
        if (!store.isAuthenticated) {
            // Redirigir al coach a la página de registro/login si no está autenticado
            navigate("/signup-coach"); // Cambia esto a la ruta de tu página de login si es necesario
        }
    }, [store.isAuthenticated, navigate]); // Dependencias de useEffect

    const handleLogout = () => {
        // Elimina el token del localStorage
        localStorage.removeItem("token");

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
            <button className="btn btn-danger mt-3" onClick={handleLogout}>
                Logout
            </button> {/* Botón para cerrar sesión */}
            <SolicitudesCoach />
        </div>
    );
};

export default ControlPanelCoach;
