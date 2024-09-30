import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const SignupSmoker = () => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Para manejar errores
    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();

        const smokerData = { email_usuario: email, password_email: password };

        try {
            const success = await actions.signupSmoker(smokerData);
            if (success) {
                // Redirige al control panel si el registro fue exitoso
                navigate("/control-panel-smoker");
            } else {
                // Manejo de error en caso de que el registro falle
                setError("Error: El registro no se pudo completar. Intenta de nuevo.");
            }
        } catch (error) {
            // Muestra un mensaje de error más específico
            if (error.message === "User already exists") {
                setError("Este email ya está en uso. Por favor, usa otro.");
            } else {
                setError("Error durante el proceso de registro: " + error.message);
            }
        }
    };

    return (
        <div className="container mt-5">
            <h1>Signup for Smokers</h1>
            {error && <div className="alert alert-danger">{error}</div>} {/* Muestra el mensaje de error */}
            <form onSubmit={handleSignup}>
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
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignupSmoker;
