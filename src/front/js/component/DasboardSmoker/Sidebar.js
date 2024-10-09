import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaClipboardList, FaBell, FaEnvelope, FaHashtag, FaSmile, FaQuestionCircle } from 'react-icons/fa';
import DropdownWithLogo from './Logo';
import { useStore } from '../../store/appContext'; // Ajusta la ruta según tu estructura

const Sidebar = () => {
    const navigate = useNavigate();
    const { store } = useStore(); // Obtiene el estado del contexto
    const { loggedInUser } = store; // Extrae el usuario logueado

    const isConnected = !!loggedInUser; // Verifica si hay un usuario conectado

    return (
        <div className="user-sidebar">
            <div>
                <h2>User's Dashboard</h2>
                <ul>
                    <li onClick={() => navigate("/Dashboard-Smoker")}>
                        <FaHome /> Dashboard
                    </li>
                    <li onClick={() => navigate("/Dashboard-Smoker/coaches")}>
                        <FaClipboardList /> Lista de Coaches
                    </li>
                    <li onClick={() => navigate("/Dashboard-Smoker/track-coach")}>
                        <FaBell /> Solicitudes
                    </li>
                    <li onClick={() => navigate("/Dashboard-Smoker/mensajes")}>
                        <FaEnvelope /> Mensajes
                    </li>
                    <li onClick={() => navigate("/Dashboard-Smoker/foros")}>
                        <FaHashtag /> Foros
                    </li>
                    <li onClick={() => navigate("/Dashboard-Smoker/relajacion")}>
                        <FaSmile /> Zona de Relajación
                    </li>
                    <li onClick={() => navigate("/Dashboard-Smoker/consejos")}>
                        <FaQuestionCircle /> Consejos
                    </li>
                </ul>
            </div>
            <DropdownWithLogo 
                isConnected={isConnected} 
                loggedInUser={loggedInUser} // Pasa el usuario logueado
                navigate={navigate} // También necesitas pasar navigate
            />
        </div>
    );
};

export default Sidebar;
