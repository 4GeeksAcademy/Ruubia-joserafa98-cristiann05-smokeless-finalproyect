import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const SignupCoach = () => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Para la confirmación de contraseña
    const [error, setError] = useState(""); // Para manejar errores
    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();

        // Verificar que las contraseñas coincidan
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden. Por favor, intenta de nuevo.");
            return;
        }

        const coachData = { email_coach: email, password_coach: password };

        try {
            const success = await actions.signupCoach(coachData); // No se pasa la imagen
            if (success) {
                // Redirige al control panel si el registro fue exitoso
                navigate("/control-panel-coach");
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
            <h1>Registro para Coaches</h1>
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
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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

export default SignupCoach;
