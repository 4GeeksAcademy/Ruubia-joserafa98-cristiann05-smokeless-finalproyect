import React, { useState, useContext } from "react"; 
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import '../../styles/signupCoach.css'; // Asegúrate de tener un CSS correspondiente

const SignupCoach = () => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();
        setError("");

        // Verificar si las contraseñas coinciden
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
            return;
        }

        // Crear el objeto de datos del coach
        const coachData = { email_coach: email, password_coach: password };
        console.log("Datos del coach que se envían:", coachData); // Muestra los datos del coach que se envían

        // Llamar a la acción de registro
        const success = await actions.signupCoach(coachData);
        if (success) {
            console.log("Registro exitoso, redirigiendo a login."); // Indica que el registro fue exitoso
            navigate("/login-coach"); // Redirigir a login si es exitoso
        } else {
            setError("Error durante el registro. Por favor, intenta de nuevo.");
            console.log("Error en el registro."); // Indica que hubo un error en el registro
        }
    };

    return (
        <div className="form-container">
            <p className="title">Registrarse como Coach</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <form className="form" onSubmit={handleSignup}>
                <div className="input-group">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="confirmPassword">Confirmar contraseña</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="sign" type="submit">Registrarse</button>
            </form>

            <div className="social-message">
                <div className="line"></div>
                <p className="message">O regístrate con cuentas sociales</p>
                <div className="line"></div>
            </div>
            <div className="social-icons">
                {/* Aquí tus botones de redes sociales */}
            </div>

            <p className="signup">¿Ya tienes una cuenta?
                <a rel="noopener noreferrer" href="/login-coach" className=""> Iniciar sesión</a>
            </p>
        </div>
    );
};

export default SignupCoach;
