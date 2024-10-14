import React, { useState } from 'react'; // Agrega useState aquí
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import '../../styles/LoginSelection.css';
import logo from '../../img/logos/logoblanco.png';
import logoOscuro from '../../img/logos/logonegro.png';

const LoginSelection = () => {
  const navigate = useNavigate(); // Usa el hook useNavigate
  const [error, setError] = useState('');

  const handleAccedeSmoker = () => {
    navigate('/login-smoker'); // Redirige a la ruta del fumador
  };

  const handleAccedeCoach = () => {
    navigate('/login-coach'); // Redirige a la ruta del coach
  };

  return (
    <>
      <div className="row g-0 justify-content-center gradient-bottom-right start-purple middle-indigo end-pink">
        <div className="col-md-6 col-lg-5 col-xl-5 position-fixed start-0 top-0 vh-100 overflow-y-hidden d-none d-lg-flex flex-lg-column">
          <div className="p-12 py-xl-10 px-xl-20">
            {/* Aquí puedes colocar tu logo */}
            <div className="d-block">
              <img src={logo} alt="Logo" className="logo" />
            </div>

            {/* Ajustes en el título y subtítulo */}
            <div className="mt-16 text-center px-5">
              <h1 className="ls-tight fw-bolder display-5 text-white mb-4">
                INICIA SESIÓN Y CONTINÚA TU CAMINO
              </h1>
              <p className="text-white text-opacity-75 pe-xl-24" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                ¿Eres Coach, o eres Fumador?
              </p>
            </div>
          </div>

        </div>

        <div className="col-12 col-md-12 col-lg-7 offset-lg-5 min-vh-100 overflow-y-auto d-flex flex-column justify-content-center position-relative bg-body rounded-top-start-lg-4 rounded shadow-soft-5">
          <div className="w-md-50 mx-auto px-10 px-md-0 py-10">
            <div className="mb-10 text-center">
              <h1 className="ls-tight fw-bolder h1">Selecciona tu tipo de cuenta</h1> 
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="d-flex flex-column">
              <button 
                className="btn btn-dark w-100 mb-3 d-flex align-items-center justify-content-center" 
                onClick={handleAccedeSmoker}
                style={{ fontSize: '1.25rem', padding: '15px' }}
              >
                <i className="fa-solid fa-smoking me-2"></i>
                Accede como Fumador
              </button>

              <button 
                className="btn btn-dark w-100 d-flex align-items-center justify-content-center" 
                onClick={handleAccedeCoach}
                style={{ fontSize: '1.25rem', padding: '15px' }}
              >
                <i className="fa-solid fa-user-tie me-2"></i>
                Accede como Coach
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginSelection;