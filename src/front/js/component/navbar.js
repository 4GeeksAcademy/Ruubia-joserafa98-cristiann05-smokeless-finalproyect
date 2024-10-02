import React, { useState, useEffect } from "react";
import "../../styles/navbar.css";
import '../../styles/switch.css';

const Navbar = ({ toggleTheme }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || "Spanish"; // Valor por defecto en español
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
        localStorage.setItem('language', language); // Guardar idioma en localStorage
    };

    useEffect(() => {
        // Establecer el idioma seleccionado basado en el estado de language
        setLanguage(localStorage.getItem('language') || "Spanish");
    }, []);

    return (
        <nav className="navbar">
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

                <label className="switch" aria-label="Toggle Theme">
                    <input type="checkbox" className="input__check" onChange={toggleTheme} />
                    <span className="slider"></span>
                </label>
            </div>
        </nav>
    );
};

export default Navbar;
