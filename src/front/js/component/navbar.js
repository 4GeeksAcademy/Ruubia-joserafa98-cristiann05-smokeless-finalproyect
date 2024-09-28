import React from "react";
import { Link } from "react-router-dom";
import logonegro from '../../img/logos/logonegro.png';
import '../../styles/navbar.css';

export const Navbar = () => {
  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        {/* Logo */}
        <Link to="/">
          <img src={logonegro} alt="logo principal en negro" style={{ width: '100px', height: 'auto' }} />
        </Link>
        <div className="ml-auto">
          <Link to="/">
            <button className="btn btn-outline-primary mx-2">Inicio</button>
          </Link>
          <Link to="/smokeruser">
            <button className="btn btn-outline-primary mx-2">Fumadores</button>
          </Link>
          <Link to="/coaches">
            <button className="btn btn-outline-secondary mx-2">Coaches</button>
          </Link>
          <Link to="/tiposconsumo">
            <button className="btn btn-outline-success mx-2">Tipos de Consumo</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
