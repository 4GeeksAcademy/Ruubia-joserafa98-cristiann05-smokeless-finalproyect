import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import FollowingList from "./seguimiento";
import CoachCard from "../component/CoachCards";

const ControlPanelSmoker = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.isAuthenticated) {
            navigate("/signup-smoker");
        }
    }, [store.isAuthenticated, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login-smoker");
    };

    return (
        <div className="container mt-5">
            <h1>Welcome to your Dashboard!</h1>
            <p>This is the control panel for smokers.</p>
            <button className="btn btn-danger mt-3" onClick={handleLogout}>
                Logout
            </button>
            <FollowingList />
            <CoachCard />
        </div>
    );
};

export default ControlPanelSmoker;
