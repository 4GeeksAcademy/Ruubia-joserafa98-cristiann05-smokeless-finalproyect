import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";
import Sidebar from "../component/DasboardSmoker/Sidebar.js"; // Importa el nuevo componente Sidebar
import Header from "../component/DasboardSmoker/Header.js"; // Importa el nuevo componente Header
import DasboardSmoker from "../component/DasboardSmoker/Navbar-dashboard.js"; // Importa el nuevo componente MainContent
import '../../styles/dashboardsmoker.css';

const DashboardSmoker = () => {
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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-dashboard-container">
            <Sidebar navigate={navigate} /> {/* Utiliza el nuevo componente Sidebar */}
            <div className="user-main-layout">
                <Header onLogout={handleLogout} /> {/* Utiliza el nuevo componente Header */}
                <DasboardSmoker 
                    navigate={navigate} 
                    loggedInUser={store.loggedInUser} 
                /> {/* Incluye MainContent aquí */}
            </div>
        </div>
    );
};

export default DashboardSmoker;
