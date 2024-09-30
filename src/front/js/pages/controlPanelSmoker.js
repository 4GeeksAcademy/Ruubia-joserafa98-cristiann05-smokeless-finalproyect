import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const ControlPanelSmoker = () => {
    const { store } = useContext(Context); // Acceder al estado global
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si el usuario está autenticado
        if (!store.isAuthenticated) {
            // Redirigir al usuario a la página de registro/login si no está autenticado
            navigate("/signup-smoker"); // Cambia esto a la ruta de tu página de login si es necesario
        }
    }, [store.isAuthenticated, navigate]); // Dependencias de useEffect

    return (
        <div className="container mt-5">
            <h1>Welcome to your Dashboard!</h1>
            <p>This is the control panel for smokers.</p>
            <p>Here you will be able to manage your profile, track your smoking habits, and much more.</p>
            <button className="btn btn-primary">Manage Profile</button>
            <button className="btn btn-secondary ml-3">Track Smoking</button>
        </div>
    );
};

export default ControlPanelSmoker;
