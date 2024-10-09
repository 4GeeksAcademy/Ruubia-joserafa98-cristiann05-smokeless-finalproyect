import React, { useState, useRef, useEffect } from 'react';
import logoImage from '../../../img/logos/imagenesweb/logodefault.jpg'; // Importa la imagen del logo

const DropdownWithLogo = ({ isConnected, loggedInUser, navigate }) => {
    const [isOpen, setIsOpen] = useState(false); // Estado para controlar el dropdown
    const dropdownRef = useRef(null); // Ref para el dropdown

    const toggleDropdown = () => {
        setIsOpen(!isOpen); // Cambia el estado al hacer clic
    };

    // Para cerrar el dropdown al hacer clic en un elemento
    const handleItemClick = () => {
        setIsOpen(false);
    };

    // Efecto para manejar el clic fuera del dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false); // Cierra el dropdown si se hace clic fuera de él
            }
        };

        // Agregar el evento de clic al documento
        document.addEventListener('mousedown', handleClickOutside);

        // Limpiar el evento al desmontar el componente
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className="custom-logo-container dropdown" ref={dropdownRef}>
            {/* Imagen del logo que actúa como botón para abrir/cerrar el dropdown */}
            <img 
                src={logoImage} // Usa la imagen local
                alt="Logo" 
                className="logo-image" 
                style={{ cursor: 'pointer', borderRadius: '8px' }} // Estilo directo para el logo
                onClick={toggleDropdown} // Llama a la función para abrir/cerrar el dropdown
            />
            <span className={`status-indicator ${isConnected ? 'online' : 'offline'}`}></span>

            {/* Dropdown de Bootstrap */}
            {isOpen && ( // Solo se muestra si isOpen es true
                <div className="dropdown-menu show" aria-labelledby="dropdownMenuButton">
                    <button 
                        className="dropdown-item" 
                        type="button" 
                        onClick={() => {
                            handleItemClick(); // Cerrar el dropdown
                            if (loggedInUser) {
                                navigate(`/Dashboard-Smoker/user-profile/${loggedInUser.id}`); // Navegar al perfil del usuario
                            } else {
                                console.error("loggedInUser is not defined");
                            }
                        }}
                    >
                        <i className="fas fa-user icon" /> {/* Icono de usuario */}
                        Mostrar perfil
                    </button>
                    <button className="dropdown-item" type="button" onClick={handleItemClick}>
                        <i className="fas fa-cog icon" /> {/* Icono de configuración */}
                        Configuraciones
                    </button>
                    <button className="btn btn-secondary ml-3" onClick={() => navigate("/track-coach")}>Solicitudes</button>
                </div>
            )}
        </div>
    );
};

export default DropdownWithLogo;
