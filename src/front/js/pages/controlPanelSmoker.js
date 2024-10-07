import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import CoachCard from "../component/CoachCards";

const ControlPanelSmoker = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate('/');
            } else {
                setLoading(false);
            }
        };

        checkToken();
    }, [navigate]);

    const handleLogout = () => {
        actions.logoutsmoker();
        navigate('/');
    };

    const handleViewCoaches = () => {
        navigate('/coach-available'); // Redirige a la nueva página de coaches
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    const handleViewApprovedCoaches = () => {
        navigate('/approved-coaches'); // Redirige a la página de coaches aprobados
    };
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h1>Welcome to your Dashboard!</h1>
            <p>This is the control panel for smoker.</p>
            
            <button 
                className="btn btn-primary mt-3" 
                onClick={() => {
                    if (store.loggedInUser) {
                        navigate(`/user-profile/${store.loggedInUser.id}`);
                    } else {
                        console.error("loggedInSmoker is not defined");
                    }
                }}
            >
                Ver Perfil del Fumador
            </button>

            <button className="btn btn-info mt-3" onClick={() => navigate("/control-panel-coach/map")}>
                View Coach Map
            </button>

            <button className="btn btn-primary mt-3" onClick={handleViewCoaches}>
                Ver Coaches Disponibles
            </button>

            <button className="btn btn-secondary mt-3" onClick={handleViewApprovedCoaches}>
                Ver Coaches Aprobados
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default ControlPanelSmoker;
