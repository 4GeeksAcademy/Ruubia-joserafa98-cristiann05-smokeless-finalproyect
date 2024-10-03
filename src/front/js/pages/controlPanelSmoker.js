import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import FollowingList from "./seguimiento";
import CoachCard from "../component/CoachCards";

const ControlPanelSmoker = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Para mostrar algo mientras se verifica el token

    useEffect(() => {
        const verifyToken = async () => {
            const success = await actions.checkAuth(); // Llama a checkAuth

            if (!success) {
                navigate('/'); // Redirige a la página principal si el token no es válido
            }
            setLoading(false); // Deja de cargar una vez verificado
        };

        verifyToken();
    }, [actions, navigate]);

    const handleLogout = () => {
        actions.logout(); // Llama a la función de logout desde el contexto
        navigate('/'); // Redirige a la página principal después de cerrar sesión
    };

    if (loading) {
        return <div>Loading...</div>; // Mostrar mientras se verifica el token
    }

    return (
        <div className="container mt-5">
            <h1>Welcome to your Dashboard!</h1>
            <p>This is the control panel for smokers.</p>
            <button className="btn btn-danger" onClick={handleLogout}>
                Logout
            </button>
            <FollowingList />
            <CoachCard />
        </div>
    );
};

export default ControlPanelSmoker;

