import React, { useContext, useEffect, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import FollowingList from "./seguimiento";
import CoachCard from "../component/CoachCards";

const ControlPanelSmoker = () => {

    const navigate = useNavigate();
    const { store, actions } = useContext(Context);
    const { setStore } = actions; // Asegúrate de obtener setStore desde actions


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setStore({ isAuthenticated: true });
        } else {
            navigate("/signup-smoker");
        }
    }, [navigate, setStore]);
    
    

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

