import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";





const ControlPanelCoach = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const { coach } = store; // Asegúrate de que 'coach' esté en tu store

    useEffect(() => {
        if (!store.isAuthenticated) {
            navigate("/login-coach");
        }
    }, [store.isAuthenticated, navigate]);

    const handleLogout = () => {
        actions.logoutCoach();
        navigate("/login-coach");
    };

    return (
        <div className="container mt-5">
            <h1>Welcome to your Dashboard!</h1>
            <p>This is the control panel for coaches.</p>
            <p>Here you will be able to manage your profile, track your clients' progress, and much more.</p>
            <button className="btn btn-primary">Manage Profile</button>
            <button className="btn btn-secondary ml-3" onClick={() => navigate("/track-client")}>Track Clients</button>
            <button className="btn btn-primary ml-3" onClick={() => navigate(`/coach-profile/${store.loggedInCoach.id}`)}>View My Profile</button>
            <button className="btn btn-info mt-3" onClick={() => navigate("/control-panel-coach/map")}>
                View Coach Map
            </button>
            <button className="btn btn-danger mt-3" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default ControlPanelCoach;

