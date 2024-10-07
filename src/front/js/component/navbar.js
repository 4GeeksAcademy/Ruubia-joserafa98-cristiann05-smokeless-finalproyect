import React, { useState, useEffect } from "react";
import logoDark from '../../img/logos/logoblanco.png'; // Logo blanco para modo oscuro
import logoLight from '../../img/logos/logonegro.png'; // Logo negro para modo claro
import { Link } from 'react-router-dom'; 
import Switch from '../component/Switch'; // Importar el componente Switch
import "../../styles/switch.css";
import "../../styles/navbar.css";

const Navbar = ({ toggleTheme, theme }) => {
    // Cambiar el idioma inicial a 'English' y almacenar en localStorage
    const [language, setLanguage] = useState(() => {
        const savedLanguage = localStorage.getItem('language');
        return savedLanguage ? savedLanguage : "English"; // Establece "English" como idioma predeterminado
    });

    const icons = {
        english: "🇬🇧",
        spanish: "🇪🇸",
        french: "🇫🇷",
        german: "🇩🇪",
        italian: "🇮🇹"
    };

    const listItems = ["English", "Spanish", "French", "German", "Italian"];

    const handleItemClick = (language) => {
        setLanguage(language);
        localStorage.setItem('language', language);
    };

    useEffect(() => {
        setLanguage(localStorage.getItem('language') || "English"); // Establecer el idioma a inglés si no hay
    }, []);

    return (
        <nav className={`navbar ${theme === 'dark' ? 'navbar--dark' : 'navbar--light'}`}>
            <div className="logo-container">
                <Link to="/">
                    <img 
                        src={theme === 'light' ? logoLight : logoDark} 
                        alt="Logo" 
                        className="logo" 
                    />
                </Link>
            </div>
            <div className="navbar-controls">
                <div className="dropdown">
                    <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <span className="dropdown-title-icon">{icons[language.toLowerCase()]}</span>
                        <span className="dropdown-title">{language}</span>
                    </button>

                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        {listItems.map((item) => (
                            <li key={item}>
                                <button
                                    className="dropdown-item"
                                    onClick={() => handleItemClick(item)}
                                >
                                    <span className="text-truncate">{icons[item.toLowerCase()]} {item}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Agregar el Switch aquí */}
                <Switch theme={theme} toggleTheme={toggleTheme} />
            </div>
        </nav>
    );
};

export default Navbar;
