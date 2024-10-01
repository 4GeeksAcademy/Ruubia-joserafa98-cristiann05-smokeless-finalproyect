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
          {/* Nuevos botones de Registrarse e Iniciar Sesión como fumador */}
          <Link to="/login-smoker">
            <button className="btn btn-outline-info mx-2">Iniciar Sesión fumador</button>
          </Link>
          <Link to="/signup-smoker">
            <button className="btn btn-outline-warning mx-2">Registrarse como fumador</button>
          </Link>
          {/* Nuevos botones de Registrarse e Iniciar Sesión como coach */}

          <Link to="/login-coach">
            <button className="btn btn-outline-info mx-2">Iniciar Sesión coach</button>
          </Link>
          <Link to="/signup-coach">
            <button className="btn btn-outline-warning mx-2">Registrarse como coach</button>
          </Link>

           {/* Nuevos botones de formularios como seguimiento y solicitudes[JOSE] */}

           <Link to="/seguimiento">
            <button className="btn btn-outline-info mx-2">seguimiento</button>
          </Link>
          <Link to="/ejemplo">
            <button className="btn btn-outline-warning mx-2">ejemplo</button>
          </Link>



        </div>
      </div>
    </nav>
  );
};
