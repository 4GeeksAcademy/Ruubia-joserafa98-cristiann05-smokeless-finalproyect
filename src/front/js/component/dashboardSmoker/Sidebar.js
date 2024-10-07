import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Sidebar.css'; // Asegúrate de tener un archivo CSS para el estilo de la Sidebar

const Sidebar = () => {
  const navigate = useNavigate(); // Hook para la navegación

  return (
    <div className="col-sm-3 col-md-2 sidebar">
      <ul className="nav nav-sidebar">
        <li className="active">
          <a onClick={() => navigate("/dashboard")}>
            <span className="icon lnr lnr-user"></span>
            Dashboard
            <span className="sr-only">(current)</span>
          </a>
        </li>
      </ul>
      <ul className="nav nav-sidebar">
        <li>
          <a onClick={() => navigate("/coaches")}>
            <span className="icon lnr lnr-store"></span>
            Coaches
          </a>
        </li>
        <li>
          <a onClick={() => navigate("/mensajes")}>
            <span className="icon lnr lnr-cart"></span>
            Mensajes
          </a>
        </li>
        <li>
          <a onClick={() => navigate("/foros")}>
            <span className="icon lnr lnr-tag"></span>
            Foros
          </a>
        </li>
        <li>
          <a onClick={() => navigate("/zona-relajacion")}>
            <span className="icon lnr lnr-calendar-full"></span>
            Zona de Relajación
          </a>
        </li>
        <li>
          <a onClick={() => navigate("/actividades")}>
            <span className="icon lnr lnr-license"></span>
            Actividades
          </a>
        </li>
      </ul>
      <ul className="nav nav-sidebar">
        <li>
          <a onClick={() => navigate("/news-events")}>
            <span className="icon lnr lnr-bookmark"></span>
            News & Events
          </a>
        </li>
        <li>
          <a onClick={() => navigate("/terms")}>
            <span className="icon lnr lnr-lock"></span>
            Terms and Conditions
          </a>
        </li>
        <li>
          <a onClick={() => navigate("/privacy")}>
            <span className="icon lnr lnr-bookmark"></span>
            Privacy Policy
          </a>
        </li>
        <li>
          <a onClick={() => navigate("/about")}>
            <span className="icon lnr lnr-bookmark"></span>
            About Us
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
