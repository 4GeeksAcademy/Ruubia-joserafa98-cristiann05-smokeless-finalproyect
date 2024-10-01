import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const LoginSmoker = () => {
  const { actions } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const smokerData = { email_usuario: email, password_email: password };
    
    try {
      const success = await actions.loginSmoker(smokerData);
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/control-panel-smoker");
        }, 2000);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };

    return (
        <div className="container mt-5">
            <h1>Login for Smokers</h1>
            {error && <div className="alert alert-danger" role="alert">Error: Credenciales inválidas. Por favor, inténtalo de nuevo.</div>} {/* Muestra el mensaje de error */}
            {success && <div className="alert alert-success" role="alert">Inicio de sesión exitoso. Redirigiendo al panel de control...</div>} {/* Muestra el mensaje de éxito */}
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                    Log In
                </button>
            </form>
        </div>
    );
};

export default LoginSmoker;
