import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const SignupSmoker = () => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Estado para la confirmación
    const [error, setError] = useState(""); // Para manejar errores
    const [successMessage, setSuccessMessage] = useState(""); // Para manejar mensajes de éxito
    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();

        // Limpiar los mensajes de error y éxito
        setError("");
        setSuccessMessage("");

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
            return;
        }

        const smokerData = { email_usuario: email, password_email: password };

        try {
            const success = await actions.signupSmoker(smokerData);
            if (success) {
                // Mostrar un mensaje de éxito y redirigir al login
                setSuccessMessage("Registro exitoso. Redirigiendo al login...");
                setTimeout(() => {
                    navigate("/login-smoker"); // Cambia la ruta al login
                }, 2000); // Redirige después de 2 segundos
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
            {successMessage && <div className="alert alert-success">{successMessage}</div>} {/* Muestra el mensaje de éxito */}
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
                    <label>Confirm Password</label> {/* Campo de confirmación */}
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

export default SignupSmoker;
