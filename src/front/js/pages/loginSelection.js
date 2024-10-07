import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import '../../styles/LoginSelection.css';
import fumadorImage from '../../img/logos/animacion-login/cigarretecolor.png'; // Reemplaza con la ruta correcta
import coachImage from '../../img/logos/animacion-login/trainer.png'; // Reemplaza con la ruta correcta
import Navbar from '../component/navbar';

const LoginSelection = () => {
  const navigate = useNavigate(); // Usa el hook useNavigate

  const handleAccedeSmoker = () => {
    navigate('/login-smoker'); // Redirige a la ruta del fumador
  };

  const handleAccedeCoach = () => {
    navigate('/login-coach'); // Redirige a la ruta del coach
  };

  return (
    <>
      <Navbar />
      <div className="parent-container"> {/* Contenedor padre para centrar */}
        <div className="login-container">
          {/* Primera Tarjeta */}
          <div className="card">
            <img src={fumadorImage} alt="Fumador" className="icon" />
            <div className="content">
              <h2 className="heading">Accede como Fumador</h2>
              <p className="para">
                Conéctate y descubre tips para dejar de fumar.
              </p>
              <button className="btn" onClick={handleAccedeSmoker}>Accede</button>
            </div>
          </div>

          {/* Segunda Tarjeta */}
          <div className="card">
            <img src={coachImage} alt="Coach" className="icon" />
            <div className="content">
              <h2 className="heading">
                Accede como <br /> Coach
              </h2>
              <p className="para">
                Únete y ayuda a otros a alcanzar sus metas.
              </p>
              <button className="btn" onClick={handleAccedeCoach}>Accede</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSelection;
