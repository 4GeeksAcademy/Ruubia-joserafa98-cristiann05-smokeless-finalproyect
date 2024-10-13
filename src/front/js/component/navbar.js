import React, { useState, useEffect } from "react";
import logo from '../../img/logos/logoblanco.png'; // Ajusta según sea necesario
import { Link } from 'react-router-dom'; // Asegúrate de importar Link
import "../../styles/navbar.css";

const Navbar = () => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || "Spanish";
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
        setLanguage(localStorage.getItem('language') || "Spanish");
    }, []);

    return (
        <nav className="navbar">
            <div className="logo-container">
                <Link to="/"> {/* Enlace al logo */}
                    <img 
                        src={logo} 
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
            </div>
        </nav>
    );
};

export default Navbar;
