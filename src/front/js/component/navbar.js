import React, { useState } from "react";
import logo from '../../img/logos/logoblanco.png'; // Ajusta según sea necesario
import { Link } from 'react-router-dom';
import "../../styles/navbar.css";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Definir la función toggleMenu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        console.log("Menu open state:", !isMenuOpen); // Para verificar el estado
    };

    return (
        <nav className="navbar-container">
            {/* Logo e ícono del menú hamburguesa */}
            <div className="navbar-header">
                <Link to="/" className="logo-container">
                    <img src={logo} alt="Logo" className="logo" />
                </Link>
                <button className="navbar-toggler" onClick={toggleMenu}>
                    &#9776;
                </button>
            </div>
    
            {/* Menú desplegable */}
            <div className={`menu-container ${isMenuOpen ? 'open' : ''}`}>
                <ul className="menu-list">
                    <li className="menu-item">
                        <Link className="nav-link" to="/">Product</Link>
                    </li>
                    <li className="menu-item">
                        <Link className="nav-link" to="/">Dashboard</Link>
                    </li>
                    <li className="menu-item">
                        <Link className="btn btn-white" id="button" to="/signup-smoker">Get Started</Link> {/* Ruta actualizada */}
                    </li>
                    <li className="menu-item">
                        <Link className="btn btn-white"  id="button" to="/login-smoker">Login</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
