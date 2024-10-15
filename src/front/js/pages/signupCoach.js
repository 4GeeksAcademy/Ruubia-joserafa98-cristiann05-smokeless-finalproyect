import React, { useState, useContext } from "react"; 
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import '../../styles/signups.css'; // Asegúrate de tener un CSS correspondiente
import logo from '../../img/logos/logoblanco.png';
import logoOscuro from '../../img/logos/logonegro.png';

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
        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
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
        <div className="row g-0 justify-content-center gradient-bottom-right start-purple middle-indigo end-pink">
        <div className="col-md-6 col-lg-5 col-xl-5 position-fixed start-0 top-0 vh-100 overflow-y-hidden d-none d-lg-flex flex-lg-column">
            <div className="p-12 py-xl-10 px-xl-20">
                {/* Aquí puedes colocar tu logo */}
                <div className="d-block">
                    <img src={logo} alt="Logo" className="logo" />
                </div>

                {/* Ajustes en el título y subtítulo */}
                <div className="mt-1 text-center px-5"> {/* Añadí text-center y padding lateral */}
                    <h1 className="ls-tight fw-bolder display-6 text-white mb-1"> {/* display-3 para hacerlo más grande */}
                        ¡COMIENZA HOY!
                    </h1>
                    <p className="text-white text-opacity-75 pe-xl-24" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}> {/* Aumenta el tamaño del subtítulo */}
                    Únete a nuestra comunidad de coaches dedicados a ayudar a fumadores a alcanzar sus metas.
                    </p>
                </div>
            </div>

        </div>

        <div className="col-12 col-md-12 col-lg-7 offset-lg-5 min-vh-100 overflow-y-auto d-flex flex-column justify-content-center position-relative bg-body rounded-top-start-lg-4 rounded shadow-soft-5">
            <div className="w-md-50 mx-auto px-10 px-md-0 py-10">
                <div className="mb-10">
                    <a className="d-inline-block d-lg-none mb-10" href="/pages/dashboard.html">
                        <img src={logoOscuro} alt="Logo Oscuro" className="logo w-25" />
                    </a>
                    <h1 className="ls-tight fw-bolder h1">Sign up here</h1> 
                </div>


                {error && <div className="alert alert-danger">{error}</div>}
                <form className="form" onSubmit={handleSignup} style={{ fontSize: '1.25rem' }}> {/* Aumenta el tamaño del texto global */}
                    <div className="group mb-4">
                        <i className="fa-regular fa-envelope icon"></i>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Correo electrónico"
                            required
                            style={{ height: '60px', fontSize: '1.25rem' }}
                        />
                    </div>

                    <div className="group mb-4">
                        <i className="fa-solid fa-lock icon"></i>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="input"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            style={{ height: '60px', fontSize: '1.25rem' }}
                        />
                    </div>

                    <div className="group mb-4">
                        <i className="fa-solid fa-lock icon"></i>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            className="input"
                            placeholder="Confirmar contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                            style={{ height: '60px', fontSize: '1.25rem' }}
                        />
                    </div>

                    <button className="btn btn-dark w-100" type="submit" style={{ fontSize: '1.25rem', padding: '15px' }}>Registrarse</button> {/* Botón más grande */}
                </form>
            </div>
        </div>

    </div>
);
};

export default SignupCoach;
